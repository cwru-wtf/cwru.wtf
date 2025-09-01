# Database Migration Guide

This document explains how to migrate your existing database to support the new submission form fields.

## What's Changed

The submission form now includes these new fields:
- **Categories**: Photography/Film, Art/Design, Coding/Software, Hardware/Electronics, Other (with custom input)
- **WTF Idea**: What you want to build that would make you go WTF (100 words max)
- **Current Project**: What you have built or are building now (100 words max)  
- **YouTube Link**: A link to a YouTube video that interests you

## Database Schema Changes

The `submissions` table now has these additional columns:
- `categories` (text, NOT NULL) - JSON string of selected categories
- `other_category` (text, nullable) - Custom category if "Other" is selected
- `wtf_idea` (text, NOT NULL) - User's WTF project idea
- `current_project` (text, NOT NULL) - User's current/past projects
- `youtube_link` (text, NOT NULL) - YouTube video link
- `interests` (text, nullable) - Made nullable for backward compatibility

## How to Migrate

### Option 1: Automatic Migration (Recommended)

Run the migration script:

```bash
npm run migrate-database
```

### Option 2: Manual SQL Migration

If you prefer to run SQL manually, execute the commands in:
```
scripts/migrate-database.sql
```

### Option 3: Drizzle Migration (if it works with your setup)

```bash
npm run db:migrate
```

## Verification

After migration, verify that:
1. All existing submissions still display correctly in the admin dashboard
2. New submissions can be created with all the new fields
3. The admin dashboard shows the new field categories properly

## Rollback

If you need to rollback the changes:

```sql
-- Remove new columns
ALTER TABLE submissions DROP COLUMN IF EXISTS categories;
ALTER TABLE submissions DROP COLUMN IF EXISTS other_category;
ALTER TABLE submissions DROP COLUMN IF EXISTS wtf_idea;
ALTER TABLE submissions DROP COLUMN IF EXISTS current_project;
ALTER TABLE submissions DROP COLUMN IF EXISTS youtube_link;

-- Make interests required again
ALTER TABLE submissions ALTER COLUMN interests SET NOT NULL;
```

## Troubleshooting

- If you get permission errors, ensure your database user has ALTER privileges
- If columns already exist, the migration will skip them safely
- Check the console output for specific error messages
- Legacy submissions will show under "Legacy Interests" in the admin dashboard
