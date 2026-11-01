/**
 * Quick sanity-check: saves a test enquiry directly to MongoDB.
 * Run with:  node scripts/test-enquiry-save.js
 */

const mongoose = require('mongoose');
const fs       = require('fs');
const path     = require('path');

// ── Load .env.local manually (no dotenv dependency needed) ───────────────────
const envPath = path.join(__dirname, '..', '.env.local');
const envText = fs.readFileSync(envPath, 'utf-8');
const env     = {};
envText.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) return;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
  env[key] = val;
});

const MONGODB_URI = env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not found in .env.local');
  process.exit(1);
}

// ── Inline schema (mirrors src/models/Enquiry.js) ────────────────────────────
const EnquirySchema = new mongoose.Schema(
  {
    enquiryId:  { type: String, unique: true, sparse: true },
    name:       { type: String, required: true, trim: true },
    company:    { type: String, trim: true },
    email:      { type: String, required: true, lowercase: true, trim: true },
    phone:      { type: String, trim: true },
    country:    { type: String, trim: true },
    product:    { type: String, trim: true },
    quantity:   { type: String, trim: true },
    port:       { type: String, trim: true },
    message:    { type: String, trim: true },
    formType:   { type: String, enum: ['contact','quote','product'], default: 'contact' },
    sourcePage: { type: String, trim: true },
    status:     { type: String, default: 'new' },
    notes:      [{ content: String, addedAt: { type: Date, default: Date.now } }],
    statusHistory: [{ status: String, changedAt: { type: Date, default: Date.now } }],
    ipAddress:  { type: String },
    userAgent:  { type: String },
  },
  { timestamps: true }
);

EnquirySchema.pre('save', function (next) {
  if (this.isNew && !this.enquiryId) {
    const ts  = Date.now().toString(36).toUpperCase();
    const rnd = Math.random().toString(36).slice(2, 7).toUpperCase();
    this.enquiryId = `ENQ-${ts}-${rnd}`;
  }
  next();
});

delete mongoose.models['Enquiry'];
const Enquiry = mongoose.model('Enquiry', EnquirySchema);

// ── Run ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🔄  Connecting to MongoDB …');
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log('✅  Connected\n');

  const doc = new Enquiry({
    name:       'Test User',
    company:    'Test Company',
    email:      `test-${Date.now()}@example.com`,
    phone:      '+91 9999999999',
    product:    'Spices',
    quantity:   '5 MT',
    port:       'Dubai (Jebel Ali)',
    message:    'This is a test enquiry from the test script.',
    formType:   'quote',
    sourcePage: 'test-script',
    status:     'new',
  });

  console.log('🔄  Saving enquiry …');
  await doc.save();

  console.log('✅  Saved successfully!\n');
  console.log('─────────────────────────────────────────');
  console.log('  Enquiry ID :', doc.enquiryId);
  console.log('  MongoDB _id:', doc._id.toString());
  console.log('  Name       :', doc.name);
  console.log('  Email      :', doc.email);
  console.log('  Status     :', doc.status);
  console.log('  Created at :', doc.createdAt);
  console.log('─────────────────────────────────────────');
  console.log('\n👉  Open MongoDB Atlas → Collection "enquiries" to verify.\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('\n❌  Error:', err.message);
  process.exit(1);
});
