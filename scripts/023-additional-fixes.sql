-- Additional Schema Fixes

-- 1. Audit Submissions Table
CREATE TABLE IF NOT EXISTS audit_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_name text,
  contact_email text,
  phone text,
  website text,
  specialty text,
  services jsonb,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- 2. Ensure Patients has unique index for ON CONFLICT
-- First remove duplicates to avoid failure
DELETE FROM patients a USING patients b
WHERE a.id < b.id 
  AND a.clinic_id = b.clinic_id 
  AND a.email = b.email
  AND a.email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_patients_clinic_email ON patients (clinic_id, email) WHERE email IS NOT NULL;

-- 3. Ensure Balances table exists (from Nova Infra)
CREATE TABLE IF NOT EXISTS balances (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    credit_type text NOT NULL,
    amount numeric DEFAULT 0,
    updated_at timestamptz DEFAULT now(),
    UNIQUE(clinic_id, credit_type)
);

-- 4. Initial seed migration for balances
INSERT INTO balances (clinic_id, credit_type, amount)
SELECT clinic_id, 'ai_cheap', ai_suggestions * 100 
FROM trial_credits 
ON CONFLICT (clinic_id, credit_type) DO NOTHING;

INSERT INTO balances (clinic_id, credit_type, amount)
SELECT clinic_id, 'ai_premium', 200 
FROM trial_credits 
ON CONFLICT (clinic_id, credit_type) DO NOTHING;

-- 5. Add password field to users
DO $ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'password_hash') THEN
    ALTER TABLE users ADD COLUMN password_hash text;
  END IF;
END $;
