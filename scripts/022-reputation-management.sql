-- Phase 10: Reputation Management Schema
-- Run this script to add reputation management tables

-- Reputation settings per clinic
CREATE TABLE IF NOT EXISTS reputation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE UNIQUE,
  auto_request_enabled boolean DEFAULT true,
  rating_threshold integer DEFAULT 3,
  email_enabled boolean DEFAULT true,
  sms_enabled boolean DEFAULT true,
  request_template_email text DEFAULT 'We hope you had a great experience at {{clinic_name}}! Would you take a moment to share your feedback? It only takes a minute and helps us serve you better.',
  request_template_sms text DEFAULT 'Hi {{patient_name}}! How was your recent visit to {{clinic_name}}? We'd love your feedback! {{review_link}}',
  public_review_platforms text[] DEFAULT ARRAY['google', 'facebook'],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews table (stores all reviews - public and private)
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  author_email text,
  author_phone text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text,
  platform text DEFAULT 'manual', -- 'google', 'facebook', 'yelp', 'manual'
  review_date timestamptz DEFAULT now(),
  is_public boolean DEFAULT true,
  is_responded boolean DEFAULT false,
  response_text text,
  responded_by uuid REFERENCES users(id),
  responded_at timestamptz,
  needs_attention boolean DEFAULT false, -- true for ratings below threshold
  source text DEFAULT 'manual', -- 'manual', 'api', 'campaign'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Review requests (tracks sent review requests)
CREATE TABLE IF NOT EXISTS review_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients(id) ON DELETE SET NULL,
  channel text NOT NULL, -- 'email', 'sms'
  status text DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'completed'
  request_sent_at timestamptz,
  review_link text,
  external_id text, -- for tracking via third-party services
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_clinic_id ON reviews(clinic_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_needs_attention ON reviews(clinic_id, needs_attention) WHERE needs_attention = true;
CREATE INDEX IF NOT EXISTS idx_review_requests_clinic_id ON review_requests(clinic_id);

-- Function to handle review intercept logic
CREATE OR REPLACE FUNCTION create_review_with_intercept()
RETURNS TRIGGER AS $$
BEGIN
  -- Set needs_attention for ratings below threshold (default 3)
  IF NEW.rating < 3 THEN
    NEW.is_public := false;
    NEW.needs_attention := true;
  ELSE
    NEW.needs_attention := false;
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic intercept
DROP TRIGGER IF EXISTS review_intercept_trigger ON reviews;
CREATE TRIGGER review_intercept_trigger
  BEFORE INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION create_review_with_intercept();

-- Insert default reputation settings for existing clinics (run manually if needed)
-- INSERT INTO reputation_settings (clinic_id)
-- SELECT id FROM clinics
-- ON CONFLICT (clinic_id) DO NOTHING;

COMMENT ON TABLE reputation_settings IS 'Stores reputation management settings per clinic';
COMMENT ON TABLE reviews IS 'Stores patient reviews with public/private classification';
COMMENT ON TABLE review_requests IS 'Tracks review request campaigns sent to patients';
