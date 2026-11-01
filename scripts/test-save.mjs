import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env.local
const envText = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
const env = {};
envText.split('\n').forEach(line => {
  const t = line.trim();
  if (!t || t.startsWith('#')) return;
  const i = t.indexOf('=');
  if (i === -1) return;
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
});

// Minimal Enquiry schema
const EnquirySchema = new mongoose.Schema(
  {
    enquiryId: { type: String, unique: true, sparse: true },
    name:      { type: String, required: true, trim: true },
    company:   { type: String, trim: true },
    email:     { type: String, required: true, lowercase: true, trim: true },
    phone:     { type: String, trim: true },
    product:   { type: String, trim: true },
    quantity:  { type: String, trim: true },
    port:      { type: String, trim: true },
    message:   { type: String, trim: true },
    formType:  { type: String, enum: ['contact', 'quote', 'product'], default: 'contact' },
    sourcePage:{ type: String, trim: true },
    status:    { type: String, default: 'new' },
    notes:     [{ content: String, addedAt: { type: Date, default: Date.now } }],
    statusHistory: [{ status: String, changedAt: { type: Date, default: Date.now } }],
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// Pre-save hook: generate enquiryId — Mongoose 9 style (no next callback)
EnquirySchema.pre('save', function () {
  if (this.isNew && !this.enquiryId) {
    const ts  = Date.now().toString(36).toUpperCase();
    const rnd = Math.random().toString(36).slice(2, 7).toUpperCase();
    this.enquiryId = `ENQ-${ts}-${rnd}`;
  }
});

delete mongoose.models['Enquiry'];
const Enquiry = mongoose.model('Enquiry', EnquirySchema);

// Connect + save
console.log('\n🔄  Connecting to MongoDB …');
await mongoose.connect(env.MONGODB_URI, {
  serverSelectionTimeoutMS: 8000,
  bufferCommands: false,
});
console.log('✅  Connected\n');

const doc = new Enquiry({
  name:      'Test Customer',
  company:   'Test Company Ltd',
  email:     `test${Date.now()}@example.com`,
  phone:     '+91 9876543210',
  product:   'Spices (Turmeric)',
  quantity:  '10 MT',
  port:      'Jebel Ali, Dubai',
  message:   'Please send FOB pricing for turmeric.',
  formType:  'quote',
  sourcePage:'test-script',
  status:    'new',
});

console.log('🔄  Saving test enquiry …');
await doc.save();

console.log('✅  Saved!\n');
console.log('─────────────────────────────────────────');
console.log('  Enquiry ID :', doc.enquiryId);
console.log('  MongoDB _id:', doc._id.toString());
console.log('  Name       :', doc.name);
console.log('  Email      :', doc.email);
console.log('  Created at :', doc.createdAt.toISOString());
console.log('─────────────────────────────────────────');
console.log('\n✅  Check MongoDB Atlas → umglobal → enquiries collection\n');

await mongoose.disconnect();
process.exit(0);
