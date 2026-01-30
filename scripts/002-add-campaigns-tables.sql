-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  clinic_id UUID NOT NULL,
  name TEXT NOT NULL,
  segment_criteria JSONB,
  channels JSONB NOT NULL,
  batch_size INT DEFAULT 100,
  sends_per_minute INT DEFAULT 10,
  drip_sequence JSONB,
  a_b_test BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft',
  started_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create campaign_messages table for tracking sent messages
CREATE TABLE IF NOT EXISTS campaign_messages (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  campaign_id UUID NOT NULL,
  clinic_id UUID NOT NULL,
  recipient_email TEXT,
  recipient_phone TEXT,
  channel TEXT,
  message_content TEXT,
  status TEXT DEFAULT 'pending',
  provider_id TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  clinic_id UUID NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  source TEXT DEFAULT 'manual',
  ad_campaign_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  clinic_id UUID NOT NULL,
  patient_email TEXT,
  provider_id TEXT,
  scheduled_time TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_clinic_id ON campaigns(clinic_id);
CREATE INDEX IF NOT EXISTS idx_campaign_messages_campaign_id ON campaign_messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_messages_clinic_id ON campaign_messages(clinic_id);
CREATE INDEX IF NOT EXISTS idx_leads_clinic_id ON leads(clinic_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_id ON appointments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_time ON appointments(scheduled_time);
