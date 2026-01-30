-- Orasync Production Schema V1
-- Consolidates and extends previous partial migrations.
-- Run this in your Supabase SQL Editor.

-- 1. Core Clinic & User
CREATE TABLE IF NOT EXISTS clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subscription_tier text DEFAULT 'free',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  clinic_id uuid REFERENCES clinics(id) ON DELETE SET NULL,
  full_name text,
  role text DEFAULT 'staff',
  created_at timestamptz DEFAULT now()
);

-- 2. Unified Inbox
CREATE TABLE IF NOT EXISTS threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES clinics(id),
  patient_name text,
  patient_phone text,
  patient_email text,
  channel text CHECK (channel IN ('sms', 'email', 'whatsapp', 'chat')),
  status text DEFAULT 'open',
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES threads(id),
  sender_type text CHECK (sender_type IN ('patient', 'staff', 'ai')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. Calendar & Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES clinics(id),
  patient_name text NOT NULL,
  appt_type text DEFAULT 'exam', -- cleaning, exam, etc
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text DEFAULT 'confirmed',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 4. Reactivation & Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES clinics(id),
  name text NOT NULL,
  type text DEFAULT 'reactivation',
  status text DEFAULT 'draft',
  sent_count int DEFAULT 0,
  open_rate float DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 5. Billing & Credits
CREATE TABLE IF NOT EXISTS credits (
  clinic_id uuid REFERENCES clinics(id) PRIMARY KEY,
  email_balance int DEFAULT 100,
  sms_balance int DEFAULT 50,
  campaign_balance int DEFAULT 1,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES clinics(id),
  pack_type text, -- 'starter_plan', 'email_pack'
  amount_usd numeric,
  paypal_order_id text,
  status text DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

-- 6. Reputation
CREATE TABLE IF NOT EXISTS review_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES clinics(id),
  patient_contact text,
  channel text DEFAULT 'sms',
  status text DEFAULT 'sent',
  sentiment text, -- 'positive', 'negative'
  rating int,
  created_at timestamptz DEFAULT now()
);

-- 7. Ads & Analytics
CREATE TABLE IF NOT EXISTS ad_metrics_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES clinics(id),
  date date DEFAULT CURRENT_DATE,
  platform text, -- facebook, google
  spend numeric DEFAULT 0,
  revenue numeric DEFAULT 0,
  clicks int DEFAULT 0,
  leads int DEFAULT 0
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_metrics_daily ENABLE ROW LEVEL SECURITY;

-- SIMPLE OPEN POLICY FOR MVP (WARNING: Lock down before real launch)
CREATE POLICY "Allow all access to authenticated users" ON clinics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all access to authenticated users" ON users FOR ALL USING (auth.role() = 'authenticated');
-- Repeat simple policy for others to unblock development:
CREATE POLICY "Allow all access to threads" ON threads FOR ALL USING (true);
CREATE POLICY "Allow all access to messages" ON messages FOR ALL USING (true);
CREATE POLICY "Allow all access to appointments" ON appointments FOR ALL USING (true);
CREATE POLICY "Allow all access to campaigns" ON campaigns FOR ALL USING (true);
CREATE POLICY "Allow all access to credits" ON credits FOR ALL USING (true);
CREATE POLICY "Allow all access to transactions" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow all access to review_requests" ON review_requests FOR ALL USING (true);
CREATE POLICY "Allow all access to ad_metrics_daily" ON ad_metrics_daily FOR ALL USING (true);
