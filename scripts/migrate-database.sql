-- Migration script to add new columns to submissions table
-- Run this script against your database to add the new fields

-- Make interests column nullable (for backward compatibility)
ALTER TABLE submissions ALTER COLUMN interests DROP NOT NULL;

-- Add new columns
ALTER TABLE submissions ADD COLUMN categories text NOT NULL DEFAULT '[]';
ALTER TABLE submissions ADD COLUMN other_category text;
ALTER TABLE submissions ADD COLUMN wtf_idea text NOT NULL DEFAULT '';
ALTER TABLE submissions ADD COLUMN current_project text NOT NULL DEFAULT '';
ALTER TABLE submissions ADD COLUMN youtube_link text NOT NULL DEFAULT '';

-- Remove default values after adding columns (they were just for the migration)
ALTER TABLE submissions ALTER COLUMN categories DROP DEFAULT;
ALTER TABLE submissions ALTER COLUMN wtf_idea DROP DEFAULT;
ALTER TABLE submissions ALTER COLUMN current_project DROP DEFAULT;
ALTER TABLE submissions ALTER COLUMN youtube_link DROP DEFAULT;
