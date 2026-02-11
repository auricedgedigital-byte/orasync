-- Orasync Production Database Schema
-- Run this in order: 001 -> 002 -> 003 -> 004
-- Compatible with: PostgreSQL 15+, Supabase, Neon

-- ============================================
-- 001: Core Tables & Credits System
-- ============================================

-- Clinics table
CREATE TABLE IF NOT EXISTS clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  timezone text DEFAULT 'America/New_York',
  business_hours jsonb DEFAULT '{"monday":["09:00","17:00"],"tuesday":["09:00","17:00"],"wednesday":["09:00","17:00"],"thursday":["09:00","17:00"],"friday":["09:00","17:00"],"saturday":[],"sunday":[]}'::jsonb,
  settings jsonb DEFAULT '{}'::jsonb,
  subscription_tier text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users table (linked to clinics)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  clinic_id uuid REFERENCES clinics(id) ON DELETE SET NULL,
  full_name text,
  role text DEFAULT 'staff', -- 'admin', 'staff', 'reader'
  auth_provider text DEFAULT 'email', -- 'email', 'google', 'github'
  auth_provider_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trial credits table (atomic credit system)
CREATE TABLE IF NOT EXISTS trial_credits (
  clinic_id uuid PRIMARY KEY REFERENCES clinics(id) ON DELETE CASCADE,
  reactivation_emails int DEFAULT 200,
  reactivation_sms int DEFAULT 50,
  reactivation_whatsapp int DEFAULT 20,
  campaigns_started int DEFAULT 3,
  lead_upload_rows int DEFAULT 1000,
  booking_confirms int DEFAULT 50,
  ai_suggestions int DEFAULT 100,
  seo_applies int DEFAULT 1,
  chatbot_installs int DEFAULT 1,
  modified_at timestamptz DEFAULT now()
);

-- Usage logs (immutable audit trail)
CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action_type text NOT NULL, -- 'reactivation_emails', 'campaign_start', etc.
  amount int NOT NULL,
  related_id text, -- campaign_id, order_id, etc.
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Orders table (payments)
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  order_id text UNIQUE NOT NULL, -- PayPal order ID
  pack_id text NOT NULL, -- 'starter_plan', 'email_pack', etc.
  amount_cents int NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'created', -- 'created', 'captured', 'failed'
  paypal_tx_id text,
  captured_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 002: Patient & Lead Management
-- ============================================

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  email text,
  source text DEFAULT 'manual', -- 'manual', 'import', 'web', 'referral'
  last_visit timestamptz,
  next_due timestamptz,
  tags jsonb DEFAULT '[]'::jsonb, -- ['high-value', 'family', 'insurance-aetna']
  custom_fields jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patient history (treatments, visits)
CREATE TABLE IF NOT EXISTS patient_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  visit_date timestamptz NOT NULL,
  treatment_type text,
  notes text,
  production_value int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 003: Campaign System
-- ============================================

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  segment_criteria jsonb NOT NULL, -- {"last_visit_before":"2024-08-01","tags":[]}
  template jsonb NOT NULL, -- {"subject":"...","body":"...","tokens":["first_name"]}
  channels jsonb NOT NULL, -- {"email":true,"sms":true,"whatsapp":false}
  schedule jsonb DEFAULT '{"send_at":null,"timezone":"America/New_York"}'::jsonb,
  status text DEFAULT 'draft', -- 'draft', 'scheduled', 'running', 'paused', 'completed', 'failed'
  stats jsonb DEFAULT '{"sent":0,"delivered":0,"opened":0,"clicked":0,"replied":0,"converted":0}'::jsonb,
  estimated_recipients int DEFAULT 0,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz
);

-- Campaign messages (individual sends)
CREATE TABLE IF NOT EXISTS campaign_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients(id) ON DELETE SET NULL,
  channel text NOT NULL, -- 'email', 'sms', 'whatsapp'
  recipient text NOT NULL, -- email or phone
  content text NOT NULL,
  provider_message_id text, -- Twilio SID, SendGrid message ID, etc.
  status text DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed', 'bounced'
  error_message text,
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  replied_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Campaign batches (for tracking large sends)
CREATE TABLE IF NOT EXISTS campaign_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  batch_index int NOT NULL,
  recipient_count int NOT NULL,
  status text DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  credits_reserved int DEFAULT 0,
  credits_consumed int DEFAULT 0,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 004: Unified Inbox & Messages
-- ============================================

-- Threads (conversation containers)
CREATE TABLE IF NOT EXISTS threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients(id) ON DELETE SET NULL,
  contact_name text,
  contact_email text,
  contact_phone text,
  channel text NOT NULL CHECK (channel IN ('sms', 'email', 'whatsapp', 'chat')),
  status text DEFAULT 'open', -- 'open', 'closed', 'spam'
  priority text DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  ai_classified_intent text, -- 'booking', 'complaint', 'question', 'general'
  ai_confidence float,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Messages (individual messages)
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('patient', 'staff', 'ai', 'system')),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  content text NOT NULL,
  ai_suggested boolean DEFAULT false,
  ai_edited boolean DEFAULT false,
  attachments jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Appointments (calendar)
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients(id) ON DELETE SET NULL,
  patient_name text NOT NULL,
  patient_email text,
  patient_phone text,
  treatment_type text DEFAULT 'exam',
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  timezone text DEFAULT 'America/New_York',
  status text DEFAULT 'confirmed', -- 'confirmed', 'cancelled', 'completed', 'no-show'
  notes text,
  calendar_event_id text, -- Google Calendar event ID
  source text DEFAULT 'manual', -- 'manual', 'chatbot', 'campaign', 'web'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 005: Integrations & Webhooks
-- ============================================

-- Integration configurations (encrypted)
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  provider_name text NOT NULL, -- 'twilio', 'sendgrid', 'google_calendar', 'n8n'
  status text DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error'
  credentials jsonb, -- encrypted credentials
  settings jsonb DEFAULT '{}'::jsonb,
  last_tested_at timestamptz,
  last_error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(clinic_id, provider_name)
);

-- Webhook configurations
CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  webhook_token text NOT NULL UNIQUE,
  name text,
  endpoint_url text,
  events jsonb DEFAULT '[]'::jsonb, -- ['lead.imported', 'campaign.completed']
  is_active boolean DEFAULT true,
  last_called_at timestamptz,
  last_status_code int,
  created_at timestamptz DEFAULT now(),
  rotated_at timestamptz
);

-- Job queue (fallback when Redis not available)
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'campaign_run', 'lead_import', 'message_send'
  payload jsonb NOT NULL,
  status text DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'dead'
  priority int DEFAULT 0,
  attempts int DEFAULT 0,
  max_attempts int DEFAULT 3,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Clinic-scoped indexes
CREATE INDEX IF NOT EXISTS idx_usage_logs_clinic_id ON usage_logs(clinic_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patients_clinic_id ON patients(clinic_id);
CREATE INDEX IF NOT EXISTS idx_patients_last_visit ON patients(last_visit);
CREATE INDEX IF NOT EXISTS idx_campaigns_clinic_id ON campaigns(clinic_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaign_messages_campaign_id ON campaign_messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_messages_status ON campaign_messages(status);
CREATE INDEX IF NOT EXISTS idx_threads_clinic_id ON threads(clinic_id);
CREATE INDEX IF NOT EXISTS idx_threads_last_message ON threads(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_id ON appointments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_orders_clinic_id ON orders(clinic_id);
CREATE INDEX IF NOT EXISTS idx_jobs_clinic_id ON jobs(clinic_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies for MVP (lock down for production)
CREATE POLICY "Clinic isolation" ON clinics FOR ALL USING (
  id = current_setting('app.current_clinic_id')::uuid OR
  EXISTS (SELECT 1 FROM users WHERE users.clinic_id = clinics.id AND users.id = current_setting('app.current_user_id')::uuid)
);

CREATE POLICY "User isolation" ON users FOR ALL USING (
  id = current_setting('app.current_user_id')::uuid OR
  clinic_id = current_setting('app.current_clinic_id')::uuid
);

CREATE POLICY "Clinic data isolation" ON trial_credits FOR ALL USING (
  clinic_id = current_setting('app.current_clinic_id')::uuid
);

CREATE POLICY "Clinic data isolation" ON usage_logs FOR ALL USING (
  clinic_id = current_setting('app.current_clinic_id')::uuid
);

CREATE POLICY "Clinic data isolation" ON orders FOR ALL USING (
  clinic_id = current_setting('app.current_clinic_id')::uuid
);

CREATE POLICY "Clinic data isolation" ON patients FOR ALL USING (
  clinic_id = current_setting('app.current_clinic_id')::uuid
);

CREATE POLICY "Clinic data isolation" ON campaigns FOR ALL USING (
  clinic_id = current_setting('app.current_clinic_id')::uuid
);

CREATE POLICY "Clinic data isolation" ON campaign_messages FOR ALL USING (
  clinic_id = current_setting('app.current_clinic_id')::uuid
);

CREATE POLICY "Clinic data isolation" ON threads FOR ALL USING (
  clinic_id = current_setting('app.current_clinic_id')::uuid
);

CREATE POLICY "Clinic data isolation" ON messages FOR ALL USING (
  clinic_id = current_setting('app.current_clinic_id')::uuid
);

CREATE POLICY "Clinic data isolation" ON appointments FOR ALL USING (
  clinic_id = current_setting('app.current_clinic_id')::uuid
);

CREATE POLICY "Clinic data isolation" ON integrations FOR ALL USING (
  clinic_id = current_setting('app.current_clinic_id')::uuid
);

CREATE POLICY "Clinic data isolation" ON webhooks FOR ALL USING (
  clinic_id = current_setting('app.current_clinic_id')::uuid
);

CREATE POLICY "Clinic data isolation" ON jobs FOR ALL USING (
  clinic_id = current_setting('app.current_clinic_id')::uuid
);

-- ============================================
-- Functions & Triggers
-- ============================================

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON clinics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Initial Data
-- ============================================

-- Create a default clinic for development (optional)
-- INSERT INTO clinics (id, name) VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Clinic');
-- INSERT INTO trial_credits (clinic_id) VALUES ('00000000-0000-0000-0000-000000000001');

-- ============================================
-- End of Migration
-- ============================================
