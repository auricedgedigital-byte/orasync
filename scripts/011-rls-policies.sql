-- Orasync RLS Policies for Production
-- Run this in Supabase SQL Editor after creating tables

-- 1. Enable RLS on all tables (if not already enabled)
ALTER TABLE IF EXISTS clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS review_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ad_metrics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS trial_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS leads ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (clean slate)
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON clinics;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON users;
DROP POLICY IF EXISTS "Allow all access to threads" ON threads;
DROP POLICY IF EXISTS "Allow all access to messages" ON messages;
DROP POLICY IF EXISTS "Allow all access to appointments" ON appointments;
DROP POLICY IF EXISTS "Allow all access to campaigns" ON campaigns;
DROP POLICY IF EXISTS "Allow all access to credits" ON credits;
DROP POLICY IF EXISTS "Allow all access to transactions" ON transactions;
DROP POLICY IF EXISTS "Allow all access to review_requests" ON review_requests;
DROP POLICY IF EXISTS "Allow all access to ad_metrics_daily" ON ad_metrics_daily;

-- 3. Create proper RLS policies

-- Clinics: Users can only access their own clinic
CREATE POLICY "Users can view own clinic" ON clinics
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM users WHERE clinic_id = clinics.id
  ));

CREATE POLICY "Users can insert own clinic" ON clinics
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM users WHERE clinic_id = NEW.id
  ));

CREATE POLICY "Users can update own clinic" ON clinics
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM users WHERE clinic_id = clinics.id
  ));

-- Users: Users can view/update their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert profile for own clinic" ON users
  FOR INSERT WITH CHECK (
    auth.uid() = id OR 
    (clinic_id IN (
      SELECT id FROM clinics WHERE auth.uid() IN (
        SELECT user_id FROM users WHERE clinic_id = clinics.id
      )
    ))
  );

-- All business data: Users can only access data from their clinic
CREATE POLICY "Users can access clinic threads" ON threads
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can access clinic messages" ON messages
  FOR ALL USING (thread_id IN (
    SELECT id FROM threads 
    WHERE clinic_id IN (
      SELECT clinic_id FROM users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can access clinic appointments" ON appointments
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can access clinic campaigns" ON campaigns
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can access clinic credits" ON credits
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can access clinic transactions" ON transactions
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can access clinic review_requests" ON review_requests
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can access clinic ad_metrics_daily" ON ad_metrics_daily
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can access clinic trial_credits" ON trial_credits
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can access clinic usage_logs" ON usage_logs
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can access clinic integrations" ON integrations
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can access clinic webhooks" ON webhooks
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can access clinic jobs" ON jobs
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can access clinic orders" ON orders
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can access clinic leads" ON leads
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

-- 4. Create Functions for Getting User's Clinic ID
CREATE OR REPLACE FUNCTION get_user_clinic_id()
RETURNS UUID AS $$
  SELECT clinic_id FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- 5. Create email confirmation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically create a clinic for new users if they don't have one
  INSERT INTO clinics (name, subscription_tier)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'practice_name', 'New Practice'),
    'free'
  )
  ON CONFLICT DO NOTHING
  RETURNING id;

  -- Link user to the clinic
  UPDATE users 
  SET clinic_id = (
    SELECT id FROM clinics 
    WHERE name = COALESCE(NEW.raw_user_meta_data->>'practice_name', 'New Practice')
    ORDER BY created_at DESC 
    LIMIT 1
  )
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger for automatic clinic creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;