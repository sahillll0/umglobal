/**
 * Script to create the first admin user
 * Run with: node scripts/create-admin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Admin Schema (copy from model)
const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters']
    },
    role: {
      type: String,
      enum: ['admin', 'super_admin'],
      default: 'admin'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    // Load environment variables from .env.local manually
    const fs = require('fs');
    const path = require('path');
    
    const envPath = path.join(__dirname, '..', '.env.local');
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
      console.error('❌ Error: MONGODB_URI not found in .env.local');
      process.exit(1);
    }

    console.log('\n🔐 UM Global Exim - Create First Admin User\n');
    console.log('This script will create a super admin account for the dashboard.\n');

    // Get admin details
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 8 characters): ');
    const confirmPassword = await question('Confirm password: ');

    if (password !== confirmPassword) {
      console.error('\n❌ Error: Passwords do not match');
      rl.close();
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('\n❌ Error: Password must be at least 8 characters');
      rl.close();
      process.exit(1);
    }

    console.log('\n⏳ Connecting to database...');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });

    console.log('✅ Connected to database');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

    if (existingAdmin) {
      console.error('\n❌ Error: An admin with this email already exists');
      rl.close();
      await mongoose.connection.close();
      process.exit(1);
    }

    // Hash password
    console.log('\n⏳ Creating admin account...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const admin = new Admin({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'super_admin',
      isActive: true
    });

    await admin.save();

    console.log('\n✅ Admin account created successfully!\n');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.name);
    console.log('🔑 Role:', admin.role);
    console.log('\n🎉 You can now login at: http://localhost:3000/admin/login\n');

    rl.close();
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    rl.close();
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

createAdmin();
