
-- Create base tables to satisfy foreign key constraints
CREATE TABLE IF NOT EXISTS clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  clinic_id uuid REFERENCES clinics(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
