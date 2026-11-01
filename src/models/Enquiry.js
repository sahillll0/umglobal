import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema(
  {
    enquiryId: {
      type:   String,
      unique: true,
      sparse: true,   // allows multiple docs while enquiryId is being generated
      index:  true,
    },
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },
    company: {
      type: String,
      trim: true,
    },
    email: {
      type:     String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim:     true,
      match:    [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    product: {
      type: String,
      trim: true,
    },
    productRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Product',
    },
    quantity: {
      type: String,
      trim: true,
    },
    port: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    formType: {
      type:    String,
      enum:    ['contact', 'quote', 'product'],
      default: 'contact',
    },
    sourcePage: {
      type: String,
      trim: true,
    },
    status: {
      type:    String,
      enum:    ['new', 'contacted', 'in_progress', 'quoted', 'converted', 'closed', 'spam'],
      default: 'new',
    },
    priority: {
      type:    String,
      enum:    ['low', 'medium', 'high'],
      default: 'medium',
    },
    notes: [
      {
        content:  { type: String, required: true },
        addedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        addedAt:  { type: Date, default: Date.now },
      },
    ],
    statusHistory: [
      {
        status:    String,
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        changedAt: { type: Date, default: Date.now },
      },
    ],
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// ── Compound indexes ──────────────────────────────────────────────────────────
EnquirySchema.index({ email:     1 });
EnquirySchema.index({ status:    1 });
EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ product:   1 });
EnquirySchema.index({ country:   1 });

// ── Auto-generate enquiryId before every new save ────────────────────────────
// Mongoose 9 async pre-hooks must NOT use a next() callback — just return.
// enquiryId must NOT be marked `required` in the schema because validation
// runs before pre-save hooks; it would reject new docs before the ID is set.
EnquirySchema.pre('save', function () {
  if (this.isNew && !this.enquiryId) {
    const ts  = Date.now().toString(36).toUpperCase();
    const rnd = Math.random().toString(36).slice(2, 7).toUpperCase();
    this.enquiryId = `ENQ-${ts}-${rnd}`;
  }
});

// ── Export — delete stale cached model so hot-reload picks up schema changes ──
// Without this, Next.js dev-mode reuses the old compiled model (without the
// pre-save hook) and enquiryId is never generated.
delete mongoose.models['Enquiry'];
const Enquiry = mongoose.model('Enquiry', EnquirySchema);

export default Enquiry;
