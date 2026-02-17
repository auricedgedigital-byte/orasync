-- Add reviews table for reputation management
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    rating INTEGER CHECK (
        rating >= 1
        AND rating <= 5
    ),
    content TEXT,
    platform TEXT,
    -- 'google', 'yelp', 'facebook', 'internal'
    external_id TEXT,
    -- ID from the source platform
    review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_responded BOOLEAN DEFAULT FALSE,
    response_content TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reviews_clinic ON reviews(clinic_id);
CREATE INDEX IF NOT EXISTS idx_reviews_platform ON reviews(platform);
-- Add sample reviews for the first clinic (optional, but good for verification)
-- INSERT INTO reviews (clinic_id, author_name, rating, content, platform, review_date, is_responded)
-- SELECT id, 'Sarah Johnson', 5, 'Excellent service! Dr. Smith was very professional and caring.', 'google', NOW() - INTERVAL '2 days', TRUE FROM clinics LIMIT 1;