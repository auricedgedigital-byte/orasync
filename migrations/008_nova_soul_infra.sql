-- Nova Soul Infrastructure Migration
-- Adds balances, segments, and meta_memory
-- 1. Balances table (Generic credit system)
CREATE TABLE IF NOT EXISTS balances (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    credit_type text NOT NULL,
    -- 'ai_cheap', 'ai_premium', 'email', 'sms'
    amount numeric DEFAULT 0,
    updated_at timestamptz DEFAULT now(),
    UNIQUE(clinic_id, credit_type)
);
-- 2. Segments table (Saved lead filters)
CREATE TABLE IF NOT EXISTS segments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name text NOT NULL,
    criteria jsonb NOT NULL,
    -- Filters for patients
    recipient_count int DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
-- 3. Meta Memory (Learning Layer)
CREATE TABLE IF NOT EXISTS meta_memory (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    key text NOT NULL,
    value jsonb NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(clinic_id, key)
);
-- 4. Initial seed migration: Map trial_credits to balances
INSERT INTO balances (clinic_id, credit_type, amount)
SELECT clinic_id,
    'ai_cheap',
    ai_suggestions * 100 -- Map 100 suggestions to approx 10k tokens
FROM trial_credits ON CONFLICT (clinic_id, credit_type) DO NOTHING;
INSERT INTO balances (clinic_id, credit_type, amount)
SELECT clinic_id,
    'ai_premium',
    200 -- Seed 200 premium tokens for existing trial clinics
FROM trial_credits ON CONFLICT (clinic_id, credit_type) DO NOTHING;
-- Indexes
CREATE INDEX IF NOT EXISTS idx_balances_clinic ON balances(clinic_id);
CREATE INDEX IF NOT EXISTS idx_segments_clinic ON segments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_meta_memory_clinic ON meta_memory(clinic_id);
-- RLS
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_memory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Clinic data isolation" ON balances;
CREATE POLICY "Clinic data isolation" ON balances FOR ALL USING (
    clinic_id = current_setting('app.current_clinic_id')::uuid
);
DROP POLICY IF EXISTS "Clinic data isolation" ON segments;
CREATE POLICY "Clinic data isolation" ON segments FOR ALL USING (
    clinic_id = current_setting('app.current_clinic_id')::uuid
);
DROP POLICY IF EXISTS "Clinic data isolation" ON meta_memory;
CREATE POLICY "Clinic data isolation" ON meta_memory FOR ALL USING (
    clinic_id = current_setting('app.current_clinic_id')::uuid
);