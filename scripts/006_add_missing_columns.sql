-- Add all missing columns to the resources table
ALTER TABLE resources ADD COLUMN file_size BIGINT;
ALTER TABLE resources ADD COLUMN is_public BOOLEAN DEFAULT TRUE;
ALTER TABLE resources ADD COLUMN mime_type TEXT;
ALTER TABLE resources ADD COLUMN name TEXT;
ALTER TABLE resources ADD COLUMN subject TEXT;
ALTER TABLE resources ADD COLUMN tags TEXT[];
ALTER TABLE resources ADD COLUMN type TEXT;
ALTER TABLE resources ADD COLUMN url TEXT;

-- Remove NOT NULL constraint from the title column
ALTER TABLE resources ALTER COLUMN title DROP NOT NULL;