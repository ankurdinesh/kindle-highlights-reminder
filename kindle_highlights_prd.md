
# PRD: Kindle Highlights Reminder App

## 1. Overview
The Kindle Highlights Reminder App is a minimalist mobile web application that helps readers revisit and retain insights from their Kindle and Readwise highlights. It provides a simple daily review flow and low-friction ingestion via Readwise sync or CSV upload. The goal is to turn reading into long-term memory without overwhelming the user.

## 2. Goals and Non-Goals

### Goals (Phase 0)
- Allow users to import highlights via Readwise API token.
- Support CSV upload as a fallback ingestion method.
- Deliver a clean daily review flow showing 3–5 highlights at a time.
- Provide minimal settings: highlights per day, sync, upload.
- Keep UX extremely lightweight.

### Non-Goals (Phase 0)
- Automatic daily sync.
- Spaced repetition or advanced algorithms.
- Notifications.
- Multi-device sync or user accounts.
- Direct Kindle integration beyond Readwise.

## 3. Target User
- Readers who highlight often but rarely revisit content.
- Users who want a simple tool rather than a complex knowledge system.
- People who prefer minimalist, calm design and zero-setup workflows.
- Knowledge workers, product leaders, founders, students.

## 4. Problem Statement
Readers accumulate large numbers of highlights across Kindle and Readwise. Despite the effort spent highlighting, they rarely return to those insights. Existing tools either overwhelm users with too much content or require heavy configuration. Users need a simple, habit-forming app that gently resurfaces insights without cognitive load.

## 5. Solution Summary
A mobile web app that:
- Syncs highlights via Readwise API token.
- Allows CSV uploads.
- Shows a clean daily review of 3–5 highlights.
- Lets users mark highlights as Done, Favourite or Remind Me Later.
- Provides minimal settings and a calm reading-inspired UI.

## 6. User Stories

### Ingestion
- As a user, I want to input my Readwise API token so I can sync all my highlights automatically.
- As a user, I want to upload a CSV file in a known template so I can import highlights without Readwise.
- As a user, I want to preview a few imported highlights to verify the import worked.

### Review
- As a user, I want to see 3–5 highlights at a time so I can build a quick daily habit.
- As a user, I want to mark highlights as Done so they disappear from my review queue.
- As a user, I want to favourite highlights so I can mark them as special.
- As a user, I want to postpone a highlight so it resurfaces later.
- As a user, I want to see a “session complete” screen so I know I’m done for the day.

### Settings
- As a user, I want to control how many highlights I review daily.
- As a user, I want a manual “Sync from Readwise” button so I can update my library.
- As a user, I want to see total highlights and last sync time.

## 7. Functional Requirements

### 7.1 Readwise Integration
- Input: User pastes API token.
- System fetches books and highlights via Readwise API.
- System stores highlights locally or in a simple backend.
- Display imported count and last sync time.

### 7.2 CSV Import
- Accepts CSV in fixed template.
- Parse and validate rows.
- Show preview of three rows.
- Add to existing highlights store.

### 7.3 Daily Review Flow
- Display one highlight at a time in a centered card.
- Actions:
  - Done: mark highlight as reviewed.
  - Favourite: set favourite flag and mark reviewed.
  - Remind Me Later: move to end of queue or adjust status.
- When session ends, show completion message and progress count.

### 7.4 Settings
- Highlights/day selector (3, 5, 10).
- Sync from Readwise button.
- Upload new CSV button.
- Display total highlights.
- Display last sync time.

### 7.5 Storage
- Initial implementation: local storage or lightweight database (Supabase/Firebase).
- Data model:
  - highlight_id
  - text
  - book_title
  - source (readwise/csv)
  - status (new/done/favourite/deferred)
  - timestamps (imported_at, updated_at)

## 8. UX and UI Requirements
- Warm neutral palette.
- Typography-led design.
- Single-card-at-a-time interface.
- Smooth fades and transitions.
- Minimal navigation: Onboarding → Home (Daily Review) → Settings.
- Error states:
  - Invalid Readwise token.
  - CSV parse errors.
  - No highlights imported yet.

## 9. Technical Considerations
- Mobile web first (PWA optional).
- Simple JS/React frontend.
- Readwise API calls must handle pagination.
- Local storage acceptable for MVP.
- Optional backend simplifies future phases but not required.

## 10. Risks
- Readwise API rate limits or token issues.
- Users uploading malformed CSV files.
- Managing pagination within one-day build constraints.
- Over-scoping daily review mechanics.

## 11. Success Metrics (Phase 0)
- User connects Readwise and imports highlights within 2 minutes.
- User completes first review session immediately after ingestion.
- At least 5 returning sessions in first week for test users.
- Zero critical sync failures.

## 12. Phase 1 Preview (Not part of MVP)
- Auto sync from Readwise.
- Spaced repetition-like resurfacing.
- Streaks and richer progress indicators.
- XLSX import.
- Basic library browsing.

