-- Create trial_credits table
CREATE TABLE IF NOT EXISTS trial_credits (
  clinic_id UUID PRIMARY KEY,
  reactivation_emails INT DEFAULT 200,
  reactivation_sms INT DEFAULT 50,
  reactivation_whatsapp INT DEFAULT 20,
  campaigns_started INT DEFAULT 3,
  lead_upload_rows INT DEFAULT 1000,
  booking_confirms INT DEFAULT 50,
  ai_suggestions INT DEFAULT 100,
  seo_applies INT DEFAULT 1,
  chatbot_installs INT DEFAULT 1,
  modified_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create usage_logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  clinic_id UUID NOT NULL,
  user_id UUID,
  action_type TEXT NOT NULL,
  amount INT NOT NULL,
  related_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create integrations table for storing provider credentials
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  clinic_id UUID NOT NULL,
  provider_name TEXT NOT NULL,
  status TEXT DEFAULT 'disconnected',
  credentials JSONB,
  last_tested_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(clinic_id, provider_name)
);

-- Create webhooks table for storing webhook tokens and endpoints
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  clinic_id UUID NOT NULL UNIQUE,
  webhook_token TEXT NOT NULL UNIQUE,
  lead_upload_endpoint TEXT,
  campaign_trigger_endpoint TEXT,
  inbound_message_endpoint TEXT,
  booking_confirm_endpoint TEXT,
  ad_lead_endpoint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  rotated_at TIMESTAMPTZ
);

-- Create n8n_workflows table for tracking imported workflows
CREATE TABLE IF NOT EXISTS n8n_workflows (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  clinic_id UUID NOT NULL,
  workflow_name TEXT NOT NULL,
  workflow_json JSONB NOT NULL,
  n8n_workflow_id TEXT,
  last_run_at TIMESTAMPTZ,
  last_run_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_usage_logs_clinic_id ON usage_logs(clinic_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_integrations_clinic_id ON integrations(clinic_id);
CREATE INDEX IF NOT EXISTS idx_n8n_workflows_clinic_id ON n8n_workflows(clinic_id);
