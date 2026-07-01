# Impressions Tracking Setup

## Overview
The admin dashboard now tracks page impressions and calculates conversion rates automatically.

## Features Added
- **Page view tracking**: Automatically tracks every page load
- **Impression count**: Displays total page views in admin dashboard  
- **Conversion rate**: Calculates signup rate (signups / impressions × 100%)
- **Non-blocking**: Uses `sendBeacon` API for reliable tracking that doesn't slow down page loads

## Database Setup

### Step 1: Create the impressions table in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com/project/wbzkfbcrywxklzasjnfi
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the SQL from `supabase-migrations.sql`:

```sql
-- Create impressions table for tracking page views
CREATE TABLE IF NOT EXISTS impressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_impressions_created_at ON impressions(created_at DESC);
```

5. Click **Run** (or press Cmd/Ctrl + Enter)

### Step 2: Verify the table was created

1. Go to **Table Editor** in Supabase
2. You should see an `impressions` table with columns:
   - `id` (uuid)
   - `page_url` (text)
   - `referrer` (text, nullable)
   - `created_at` (timestamp with time zone)

### Step 3: Deploy the changes

The code changes are ready. Just push to deploy:

```bash
git add .
git commit -m "Add impression tracking and conversion rate to admin dashboard"
git push origin main
```

## How It Works

### Client-Side Tracking
- The `ImpressionTracker` component is added to the home page
- On page load, it sends a beacon request to `/track-impression`
- Uses `navigator.sendBeacon()` for reliability (falls back to `fetch()`)
- Tracks: page URL, referrer, and timestamp

### Server-Side Storage
- The `/track-impression` endpoint receives the beacon
- Inserts a record into the `impressions` table
- Fails silently to not block the user experience

### Admin Dashboard Display
The dashboard now shows 4 metrics:
1. **Total signups**: Count of waitlist entries
2. **Joined today**: Signups in the last 24 hours
3. **Page views**: Total impression count
4. **Conversion rate**: (Total signups / Page views) × 100%

## Privacy Notes
- Only tracks page URL and referrer (no personal data)
- No cookies or persistent identifiers
- No IP addresses stored
- Can track the same user multiple times (counts unique visits, not unique visitors)

## Optional: Unique Visitor Tracking

If you want to track unique visitors instead of all impressions, you can:

1. Add a session-based cookie or localStorage flag
2. Modify `track-impression.tsx` to check if already tracked
3. Only send beacon if not tracked in current session

This is more privacy-friendly but less accurate for conversion rates.
