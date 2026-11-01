import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, 'Short description cannot exceed 300 characters']
    },
    fullDescription: {
      type: String,
      trim: true
    },
    mainImage: {
      url: String,
      publicId: String,
      alt: String
    },
    additionalImages: [
      {
        url: String,
        publicId: String,
        alt: String
      }
    ],
    specifications: {
      type: Map,
      of: String
    },
    origin: {
      type: String,
      trim: true
    },
    packagingInfo: {
      type: String,
      trim: true
    },
    availablePackagingSizes: [
      {
        type: String,
        trim: true
      }
    ],
    minimumOrderQuantity: {
      type: String,
      trim: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    // Single source of truth for publish state.
    // isPublished was removed — use status === 'published' everywhere instead.
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    varieties: [
      {
        type: String,
        trim: true
      }
    ],
    sortOrder: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    },
    enquiryCount: {
      type: Number,
      default: 0
    },
    seo: {
      title: String,
      description: String,
      keywords: [String]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual so existing code that reads .isPublished still works
ProductSchema.virtual('isPublished').get(function () {
  return this.status === 'published';
});

// Indexes
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ status: 1, isFeatured: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
