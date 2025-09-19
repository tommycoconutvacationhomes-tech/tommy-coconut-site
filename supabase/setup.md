# Supabase Setup Guide for Tommy Coconut

## Quick Setup (5 minutes)

### Step 1: Create Your Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new project:
   - **Project Name**: `tommy-coconut-prod`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to Curacao (US East or South America)
   - **Pricing Plan**: Start with Free tier

### Step 2: Get Your API Keys
1. Once project is created, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **Anon/Public Key**: `eyJ...` (long string)
   - **Service Role Key**: `eyJ...` (different long string - keep secret!)

### Step 3: Run Database Setup
1. Go to **SQL Editor** in Supabase dashboard
2. Click **New query**
3. Copy the ENTIRE contents of `supabase/schema.sql`
4. Paste and click **Run**
5. You should see "Success. No rows returned"

### Step 4: Add Test Data (Optional)
1. Still in SQL Editor, click **New query**
2. Copy contents of `supabase/seed-data.sql`
3. Run it to add sample properties and data

### Step 5: Configure Netlify Environment Variables
1. Go to your Netlify dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add these variables:

```
SUPABASE_URL=https://[your-project-id].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

### Step 6: Enable Row Level Security (Important!)
Run this in SQL Editor:
```sql
-- Enable RLS on all tables
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to properties
CREATE POLICY "Public can view active properties" ON properties
    FOR SELECT USING (is_active = true);

-- Allow anon users to create inquiries
CREATE POLICY "Anyone can create inquiries" ON inquiries
    FOR INSERT WITH CHECK (true);

-- Allow anon users to create guests
CREATE POLICY "Anyone can create guest records" ON guests
    FOR INSERT WITH CHECK (true);
```

## That's it! 🎉

Your Supabase database is now ready. Test it by submitting a form on your website.

---

## Verification Checklist

- [ ] Project created on Supabase
- [ ] Schema.sql executed successfully
- [ ] Environment variables added to Netlify
- [ ] Row Level Security enabled
- [ ] Test form submission working

## Troubleshooting

**"Permission denied" errors?**
- Make sure you've enabled Row Level Security policies above

**Forms not saving to database?**
- Verify environment variables are correct in Netlify
- Check Supabase logs: **Project** → **Logs** → **API logs**

**Need to reset and start over?**
1. Go to SQL Editor
2. Run: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
3. Re-run schema.sql

## Next Steps

1. **Set up email notifications**: Supabase → Authentication → Email Templates
2. **Configure backups**: Settings → Backups (Pro plan)
3. **Monitor usage**: Check Dashboard for API calls and storage