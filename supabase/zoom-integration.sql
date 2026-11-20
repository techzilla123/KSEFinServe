-- Zoom integration tables and columns
-- Run this in Supabase SQL Editor

-- 1. Add Zoom columns to bookings table
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS zoom_join_url TEXT,
ADD COLUMN IF NOT EXISTS zoom_meeting_id TEXT,
ADD COLUMN IF NOT EXISTS zoom_start_url TEXT;

-- 2. Create zoom_tokens table for secure token storage
CREATE TABLE IF NOT EXISTS public.zoom_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- email of the admin user (e.g., 'admin@ksefinserve.com')
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at BIGINT NOT NULL, -- Unix timestamp in milliseconds
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_zoom_tokens_user_id ON public.zoom_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_zoom_tokens_expires_at ON public.zoom_tokens(expires_at);

-- RLS policies
ALTER TABLE public.zoom_tokens ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for Netlify functions)
CREATE POLICY "Service role full access" ON public.zoom_tokens
  FOR ALL USING (auth.role() = 'service_role');

-- Admin users can read their own tokens
CREATE POLICY "Admin can read own tokens" ON public.zoom_tokens
  FOR SELECT USING (auth.jwt() ->> 'email' = user_id);

-- Admin users can insert/update their own tokens
CREATE POLICY "Admin can manage own tokens" ON public.zoom_tokens
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = user_id);

CREATE POLICY "Admin can update own tokens" ON public.zoom_tokens
  FOR UPDATE USING (auth.jwt() ->> 'email' = user_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.update_zoom_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_zoom_tokens_updated_at ON public.zoom_tokens;
CREATE TRIGGER update_zoom_tokens_updated_at
  BEFORE UPDATE ON public.zoom_tokens
  FOR EACH ROW EXECUTE FUNCTION public.update_zoom_tokens_updated_at();

-- 3. Updated at trigger for bookings (if not exists)
CREATE OR REPLACE FUNCTION public.update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_bookings_updated_at();