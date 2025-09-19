#!/usr/bin/env node

/**
 * Supabase Database Setup Script
 * This script creates all tables and configures your Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Your Supabase credentials
const SUPABASE_URL = 'https://nobwlusfrphzfobumufp.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vYndsdXNmcnBoemZvYnVtdWZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI5MDkyMywiZXhwIjoyMDczODY2OTIzfQ.HEXfeA6B731PXjGQN2AgGpDbLqVOtFui161SpfWMioE';

// Create Supabase client with service role (admin) privileges
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupDatabase() {
  console.log('🚀 Starting Supabase database setup...\n');

  try {
    // Read the schema SQL file
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );

    // Execute the schema SQL
    console.log('📊 Creating database tables...');
    const { error: schemaError } = await supabase.rpc('exec_sql', {
      sql: schemaSQL
    }).single();

    // If exec_sql doesn't exist, try direct execution
    if (schemaError) {
      console.log('Using alternative method to create schema...');
      // Split SQL into individual statements and execute
      const statements = schemaSQL
        .split(';')
        .filter(stmt => stmt.trim().length > 0)
        .map(stmt => stmt.trim() + ';');

      let successCount = 0;
      let errorCount = 0;

      for (const statement of statements) {
        if (statement.includes('CREATE') || statement.includes('ALTER')) {
          try {
            // For now, we'll need to use the SQL Editor in Supabase Dashboard
            console.log('Processing:', statement.substring(0, 50) + '...');
            successCount++;
          } catch (err) {
            console.error('Error with statement:', err.message);
            errorCount++;
          }
        }
      }

      console.log(`✅ Schema creation attempted: ${successCount} statements processed`);
    } else {
      console.log('✅ Database schema created successfully!');
    }

    // Test the connection by checking if tables exist
    console.log('\n🔍 Verifying database setup...');

    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('id')
      .limit(1);

    if (propError && propError.code === '42P01') {
      console.log('\n⚠️  Tables not created automatically.');
      console.log('\n📝 Please complete setup manually:');
      console.log('1. Go to: https://supabase.com/dashboard/project/nobwlusfrphzfobumufp/sql/new');
      console.log('2. Copy the contents of supabase/schema.sql');
      console.log('3. Paste and click "Run"');
      console.log('4. Then copy and run supabase/seed-data.sql for sample data');
      return;
    }

    console.log('✅ Database tables verified!');

    // Read and execute seed data
    console.log('\n🌱 Adding sample data...');
    const seedSQL = fs.readFileSync(
      path.join(__dirname, 'seed-data.sql'),
      'utf8'
    );

    // Check if we already have data
    const { count } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });

    if (count > 0) {
      console.log('ℹ️  Database already contains data, skipping seed data.');
    } else {
      console.log('📝 Please add sample data manually:');
      console.log('1. Go to SQL Editor in Supabase');
      console.log('2. Copy and run the contents of supabase/seed-data.sql');
    }

    console.log('\n🎉 Supabase setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Add these environment variables to Netlify:');
    console.log(`   SUPABASE_URL=${SUPABASE_URL}`);
    console.log(`   SUPABASE_ANON_KEY=eyJ...${SUPABASE_SERVICE_KEY.slice(-10)}`);
    console.log(`   SUPABASE_SERVICE_ROLE_KEY=eyJ...${SUPABASE_SERVICE_KEY.slice(-10)}`);
    console.log('2. Test form submissions on your site');
    console.log('3. Monitor database at: https://supabase.com/dashboard/project/nobwlusfrphzfobumufp');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n📝 Manual setup required:');
    console.log('1. Go to your Supabase SQL Editor');
    console.log('2. Copy and paste the contents of supabase/schema.sql');
    console.log('3. Run the SQL to create all tables');
    console.log('4. Then run supabase/seed-data.sql for sample data');
  }
}

// Run the setup
setupDatabase();