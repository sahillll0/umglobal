/**
 * Quick script to create first admin user
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Load environment variables
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

// Admin Schema
const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date }
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function createFirstAdmin() {
  try {
    console.log('\n🔐 UM Global Exim - Create First Admin\n');

    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in .env.local');
      process.exit(1);
    }

    console.log('⏳ Connecting to database...');
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('✅ Connected to database\n');

    // Default admin credentials
    const adminData = {
      name: 'Admin',
      email: 'admin@umglobalexim.com',
      password: 'admin123456',  // Default password - CHANGE THIS AFTER FIRST LOGIN!
      role: 'super_admin'
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log('ℹ️  Admin account already exists!');
      console.log('\n📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔑 Role:', existingAdmin.role);
      console.log('\n⚠️  If you forgot your password, you can:');
      console.log('   1. Delete this admin from MongoDB Atlas');
      console.log('   2. Run this script again');
      console.log('\n🌐 Login at: http://localhost:3000/admin/login\n');
    } else {
      console.log('⏳ Creating admin account...');
      const hashedPassword = await bcrypt.hash(adminData.password, 12);

      const admin = new Admin({
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
        isActive: true
      });

      await admin.save();

      console.log('\n✅ Admin account created successfully!\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:    ', adminData.email);
      console.log('🔑 Password: ', adminData.password);
      console.log('👤 Name:     ', adminData.name);
      console.log('🔐 Role:     ', adminData.role);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n⚠️  IMPORTANT SECURITY NOTICE:');
      console.log('   This is a default password for first-time setup.');
      console.log('   Please change it immediately after logging in!');
      console.log('\n🌐 Login at: http://localhost:3000/admin/login\n');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

createFirstAdmin();
