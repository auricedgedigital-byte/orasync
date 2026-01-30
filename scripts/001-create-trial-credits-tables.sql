-- Create trial_credits table for tracking trial usage
CREATE TABLE IF NOT EXISTS trial_credits (
  clinic_id uuid PRIMARY KEY,
  reactivation_emails int DEFAULT 200,
  reactivation_sms int DEFAULT 50,
  reactivation_whatsapp int DEFAULT 20,
  campaigns_started int DEFAULT 3,
  lead_upload_rows int DEFAULT 1000,
  booking_confirms int DEFAULT 50,
  ai_suggestions int DEFAULT 100,
  seo_applies int DEFAULT 1,
  chatbot_installs int DEFAULT 1,
  modified_at timestamptz DEFAULT now(),
  CONSTRAINT fk_clinic FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
);

-- Create usage_logs table for tracking all credit usage
CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL,
  user_id uuid,
  action_type text NOT NULL,
  amount int NOT NULL,
  related_id text,
  details jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_clinic_usage FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_usage FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create webhooks table for storing webhook tokens
CREATE TABLE IF NOT EXISTS webhooks (
  clinic_id uuid PRIMARY KEY,
  webhook_token text NOT NULL UNIQUE,
  rotated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_clinic_webhook FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_usage_logs_clinic_id ON usage_logs(clinic_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_action_type ON usage_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_webhooks_token ON webhooks(webhook_token);
