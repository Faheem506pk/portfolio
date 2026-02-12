const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually read .env.local
const envPath = path.resolve(__dirname, '../../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2];
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const email = 'faheemiqbalm@gmail.com';
const password = 'Admin1122@*ok';
const username = 'faheem506pk';

async function seedAdmin() {
  console.log(`Attempting to sign up user: ${email}`);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username,
      },
    },
  });

  if (error) {
    console.error('Error creating user:', error.message);
  } else {
    console.log('User created successfully:', data);
    if (data.user && data.user.identities && data.user.identities.length === 0) {
        console.log('User already exists (likely).');
    }
    if (data.session) {
        console.log('User auto-confirmed and logged in.');
    } else {
        console.log('User created. Please check email for confirmation link if enabled.');
    }
  }
}

seedAdmin();
