import mongoose from 'mongoose';

const WebsiteContentSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true,
      enum: [
        'homepage_hero',
        'homepage_about',
        'homepage_cta',
        'about_page',
        'contact_info',
        'global_settings',
        'footer_content'
      ]
    },
    content: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.WebsiteContent || mongoose.model('WebsiteContent', WebsiteContentSchema);
