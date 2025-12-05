
# PRODUCT BRIEF: KINDLE HIGHLIGHTS REMINDER APP

## TARGET USER
Readers who highlight constantly but never revisit their notes.  
High-intent learners who want their reading to compound into insight with zero friction.  
They prefer simple, beautiful apps that quietly support their habits.

Includes founders, product leaders, students and knowledge workers who read to think better.

## PROBLEM
Users accumulate hundreds of highlights. They rarely return to them because there is no simple review loop and ingestion is painful unless automated.  
Readwise solves ingestion but overwhelms users.  
Users want a minimalist daily review tool that just works.

## SOLUTION
A mobile web app that:
1. Pulls highlights automatically via Readwise  
2. Allows optional CSV upload  
3. Shows 3–5 highlights daily in a clean card flow  
4. Helps users build recall with zero friction

Purpose: turn reading into memory.

## SUCCESS METRICS
### Primary
- Daily and weekly active reviewers

### Secondary
- Highlights resurfaced
- Favourites added
- Daily session completion rate
- Week 4 and Week 12 retention

### Outcome
Users report improved recall and idea application.

## DESIGN STYLE
Minimal, calm, typographic, one-card-at-a-time, warm tones, smooth transitions.

# PHASE 0: Mobile Web MVP with Readwise Sync (One-day Build)

## GOAL
Ship a working highlights review app with Readwise sync, CSV fallback and daily review.

## FEATURES
### Readwise Sync
- User enters API token
- Fetch books and highlights
- Store locally or simple backend
- Show imported count

### CSV Upload
- Basic ingestion
- Template-based
- Preview first 3 rows

### Daily Review Flow
- 3–5 highlight cards
- Actions: Done, Favourite, Remind me later
- Simple completion screen

### Settings
- Highlights per day
- Sync from Readwise
- Upload CSV
- Show total highlights and last sync time

### Storage
- Local storage or Supabase/Firebase lightweight backend

## NON-GOALS
Auto sync, complex algorithms, editing, multi-device, notifications.

## SUCCESS METRIC
User connects Readwise and completes a review session within 2 minutes.

# PHASE 1: Automation and Intelligence

## GOAL
Make the app hands-off and smarter in resurfacing.

## FEATURES
- Auto sync
- Simple “due highlights” model
- Improved daily session with streaks
- Optional library view
- XLSX upload

## NON-GOALS
Direct Kindle integration, ML models, social features.

## SUCCESS METRIC
Users stop manually syncing and retention improves.
