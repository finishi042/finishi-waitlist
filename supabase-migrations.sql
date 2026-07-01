-- Create impressions table for tracking page views
CREATE TABLE IF NOT EXISTS impressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_impressions_created_at ON impressions(created_at DESC);

-- Optional: Add a check to ensure we have a waitlist table
-- If you haven't created it yet, uncomment and run this:
-- CREATE TABLE IF NOT EXISTS waitlist (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   email TEXT UNIQUE NOT NULL,
--   learning_goal TEXT,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );
-- 
-- CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
-- CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
