import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    subtitle: {
      type: String,
      trim: true
    },
    image: {
      url: String,
      publicId: String,
      alt: String
    },
    icon: {
      type: String,
      default: 'Package'
    },
    badge: {
      type: String,
      trim: true
    },
    sortOrder: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    productCount: {
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
    timestamps: true
  }
);

// Create index for slug
CategorySchema.index({ slug: 1 });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
