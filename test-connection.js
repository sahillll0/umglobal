// Test MongoDB connection
const mongoose = require('mongoose');

// Load environment variables
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').replace(/^["']|["']$/g, '').trim();
  }
});

const MONGODB_URI = envVars.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

console.log('🔄 Testing MongoDB connection...');
console.log('📍 Connecting to:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('✅ IP address is whitelisted');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    console.log('\n📋 To fix this:');
    console.log('1. Go to: https://cloud.mongodb.com');
    console.log('2. Click "Network Access" in left sidebar');
    console.log('3. Click "Add IP Address"');
    console.log('4. Click "Allow Access from Anywhere" (0.0.0.0/0)');
    console.log('5. Wait 1-2 minutes and try again');
    process.exit(1);
  });
