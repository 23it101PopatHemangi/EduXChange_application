-- Add the is_public column to the resources table
ALTER TABLE resources ADD COLUMN is_public BOOLEAN DEFAULT TRUE;