-- Create orders table for PayPal order tracking with idempotency support
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL,
  order_id text NOT NULL UNIQUE,
  pack_id text NOT NULL,
  amount_cents int NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'created',
  paypal_tx_id text,
  created_at timestamptz DEFAULT now(),
  captured_at timestamptz,
  CONSTRAINT fk_clinic_orders FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
);

-- Create jobs table for worker queue (used as fallback when REDIS_URL is missing)
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL,
  type text NOT NULL,
  payload jsonb NOT NULL,
  status text DEFAULT 'pending',
  attempt int DEFAULT 0,
  max_attempts int DEFAULT 3,
  error_message text,
  created_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  CONSTRAINT fk_clinic_jobs FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_clinic_id ON orders(clinic_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_jobs_clinic_id ON jobs(clinic_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
