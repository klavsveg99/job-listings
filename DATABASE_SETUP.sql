-- Create jobs table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'saved',
  url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX jobs_user_id_idx ON jobs(user_id);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only see their own jobs
CREATE POLICY "Users can view their own jobs" ON jobs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy: Users can insert their own jobs
CREATE POLICY "Users can insert their own jobs" ON jobs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: Users can update their own jobs
CREATE POLICY "Users can update their own jobs" ON jobs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: Users can delete their own jobs
CREATE POLICY "Users can delete their own jobs" ON jobs
  FOR DELETE
  USING (auth.uid() = user_id);
