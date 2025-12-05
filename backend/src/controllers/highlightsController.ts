import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../config/database';

export const getHighlights = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { status, limit, offset } = req.query;

    let query = 'SELECT * FROM highlights WHERE user_id = $1';
    const params: any[] = [userId];

    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }

    query += ' ORDER BY imported_at DESC';

    if (limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(parseInt(limit as string));
    }

    if (offset) {
      query += ` OFFSET $${params.length + 1}`;
      params.push(parseInt(offset as string));
    }

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Get highlights error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createHighlights = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { highlights } = req.body;

    if (!Array.isArray(highlights) || highlights.length === 0) {
      return res.status(400).json({ error: 'Highlights array is required' });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const insertedHighlights = [];

      for (const highlight of highlights) {
        const { externalId, text, bookTitle, author, status, source } = highlight;

        if (!text || !bookTitle) {
          continue; // Skip invalid highlights
        }

        const result = await client.query(
          `INSERT INTO highlights (user_id, external_id, text, book_title, author, status, source)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (user_id, external_id)
           DO UPDATE SET text = EXCLUDED.text,
                        book_title = EXCLUDED.book_title,
                        author = EXCLUDED.author,
                        updated_at = CURRENT_TIMESTAMP
           RETURNING *`,
          [userId, externalId || `generated-${Date.now()}-${Math.random()}`, text, bookTitle, author || null, status || 'new', source || 'csv']
        );

        insertedHighlights.push(result.rows[0]);
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        count: insertedHighlights.length,
        highlights: insertedHighlights,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create highlights error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateHighlight = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { status, deferredUntil } = req.body;

    const result = await pool.query(
      `UPDATE highlights
       SET status = COALESCE($1, status),
           deferred_until = COALESCE($2, deferred_until),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [status, deferredUntil, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Highlight not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update highlight error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteHighlight = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM highlights WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Highlight not found' });
    }

    res.json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error('Delete highlight error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const syncHighlights = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { highlights } = req.body;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // If client provides highlights, upsert them with deduplication
      if (highlights && Array.isArray(highlights)) {
        for (const highlight of highlights) {
          const { externalId, text, bookTitle, author, status, deferredUntil, source } = highlight;

          if (!text || !bookTitle) {
            continue;
          }

          // Check for duplicate based on text + book title (for CSV + Readwise merging)
          const duplicate = await client.query(
            `SELECT id FROM highlights
             WHERE user_id = $1 AND text = $2 AND book_title = $3
             LIMIT 1`,
            [userId, text, bookTitle]
          );

          if (duplicate.rows.length > 0) {
            // Update existing highlight instead of creating duplicate
            await client.query(
              `UPDATE highlights
               SET status = $1, deferred_until = $2, updated_at = CURRENT_TIMESTAMP
               WHERE id = $3`,
              [status || 'new', deferredUntil || null, duplicate.rows[0].id]
            );
          } else {
            // Insert new highlight
            await client.query(
              `INSERT INTO highlights (user_id, external_id, text, book_title, author, status, deferred_until, source)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [
                userId,
                externalId || `generated-${Date.now()}-${Math.random()}`,
                text,
                bookTitle,
                author || null,
                status || 'new',
                deferredUntil || null,
                source || 'csv'
              ]
            );
          }
        }
      }

      // Return all user's highlights
      const allHighlights = await client.query(
        'SELECT * FROM highlights WHERE user_id = $1 ORDER BY imported_at DESC',
        [userId]
      );

      await client.query('COMMIT');

      res.json({
        highlights: allHighlights.rows,
        deletedIds: [], // For future use with deletion sync
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Sync highlights error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const result = await pool.query(
      'SELECT * FROM user_settings WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      // Create default settings
      const newSettings = await pool.query(
        'INSERT INTO user_settings (user_id, highlights_per_day) VALUES ($1, $2) RETURNING *',
        [userId, 5]
      );
      return res.json(newSettings.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { highlightsPerDay, lastCsvUpload, syncMethod } = req.body;

    const result = await pool.query(
      `UPDATE user_settings
       SET highlights_per_day = COALESCE($1, highlights_per_day),
           last_csv_upload = COALESCE($2, last_csv_upload),
           sync_method = COALESCE($3, sync_method),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $4
       RETURNING *`,
      [highlightsPerDay, lastCsvUpload, syncMethod, userId]
    );

    if (result.rows.length === 0) {
      // Create settings if they don't exist
      const newSettings = await pool.query(
        `INSERT INTO user_settings (user_id, highlights_per_day, last_csv_upload, sync_method)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, highlightsPerDay || 3, lastCsvUpload, syncMethod]
      );
      return res.json(newSettings.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
