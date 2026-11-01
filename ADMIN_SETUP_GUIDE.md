# UM Global Exim - Admin Dashboard Setup Guide

## 🎯 Overview

This guide will help you set up and configure the complete admin dashboard for your UM Global Exim website.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (already configured)
- Cloudinary account (free tier for image uploads)
- Resend email account (already configured)

## ⚙️ Step 1: Configure Environment Variables

Update your `.env.local` file with the following required variables:

```env
# Resend API (Already Configured)
RESEND_API_KEY=your_resend_api_key
OWNER_EMAIL=your_email@example.com

# MongoDB Connection (Already Configured)
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration (Required)
NEXTAUTH_SECRET=your_random_secret_here_minimum_32_characters
NEXTAUTH_URL=http://localhost:3000

# Cloudinary Configuration (Required for Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Generating NEXTAUTH_SECRET

Run this command to generate a secure random secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Setting up Cloudinary (Free)

1. Sign up at https://cloudinary.com (free tier includes 25 GB storage)
2. Go to Dashboard
3. Copy your **Cloud Name**, **API Key**, and **API Secret**
4. Add them to `.env.local`

## 🔐 Step 2: Create First Admin User

Run the admin creation script:

```bash
node scripts/create-admin.js
```

Follow the prompts:
- Enter your name
- Enter your email
- Create a strong password (minimum 8 characters)
- Confirm password

The script will:
- Connect to your MongoDB database
- Hash your password securely
- Create a super admin account
- Confirm successful creation

## 🚀 Step 3: Start Development Server

```bash
npm run dev
```

The server will start at http://localhost:3000

## 🔑 Step 4: Login to Admin Dashboard

1. Navigate to: http://localhost:3000/admin/login
2. Enter your email and password
3. Click "Sign In to Dashboard"

You will be redirected to the admin dashboard at `/admin`

## 📁 Admin Dashboard Features

### 1. Dashboard (`/admin`)
- Total products, published/draft counts
- Total enquiries, new enquiries
- Today's enquiries, this month's enquiries
- Recent enquiries table
- Quick actions

### 2. Products Management (`/admin/products`)
- View all products in a table
- Add new products with images
- Edit existing products
- Publish/unpublish products
- Mark products as featured
- Upload multiple images per product
- Set product specifications
- SEO optimization fields

### 3. Categories Management (`/admin/categories`)
- Create and manage product categories
- Upload category images
- Set category descriptions
- Publish/unpublish categories
- Assign products to categories

### 4. Enquiries Management (`/admin/enquiries`)
- View all customer enquiries
- Filter by date, status, product, country
- Change enquiry status (New, Contacted, In Progress, Quoted, Converted, Closed, Spam)
- Add internal notes
- Export to CSV
- Search by name, email, phone, company

### 5. Website Content Management (`/admin/content`)
- Edit homepage hero section
- Update about us content
- Manage contact information
- Update footer content
- Configure global settings

### 6. Media Library (`/admin/media`)
- View all uploaded images
- Upload new images
- Copy image URLs
- Delete unused images
- Search and filter media

### 7. Reports (`/admin/reports`)
- Enquiries by date range
- Enquiries by product
- Enquiries by country
- Product performance
- Export reports to CSV

### 8. Settings (`/admin/settings`)
- Admin account management
- Change password
- Update business information

## 🔒 Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with 12 salt rounds
2. **Session Management**: JWT-based sessions with 24-hour expiration
3. **Protected Routes**: Middleware automatically protects all `/admin` routes
4. **Server-side Validation**: All admin operations validated on the server
5. **Rate Limiting**: Consider implementing rate limiting for production

## 📊 Database Collections

The admin dashboard creates these MongoDB collections:

1. **admins**: Admin user accounts
2. **products**: Product catalog
3. **categories**: Product categories
4. **enquiries**: Customer enquiries and contact forms
5. **websitecontents**: Editable website content sections

## 🖼️ Image Upload Flow

1. Admin selects image in dashboard
2. Image is converted to base64
3. Uploaded to Cloudinary via API
4. Cloudinary URL and public ID saved to database
5. Image displayed on public website

## 🌐 Public Website Integration

The admin dashboard automatically updates:

- **Product Pages**: Products are fetched from database dynamically
- **Category Pages**: Categories display database content
- **Contact Forms**: All submissions saved to database
- **Homepage**: Featured products displayed from database

## 🐛 Troubleshooting

### "NEXTAUTH_SECRET not found"
- Add `NEXTAUTH_SECRET` to `.env.local`
- Restart your development server

### "Cloudinary configuration missing"
- Verify all three Cloudinary variables are set
- Check for typos in variable names

### "Cannot connect to MongoDB"
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access (allow your IP)
- Ensure database user has read/write permissions

### Admin login not working
- Verify admin account was created successfully
- Check browser console for errors
- Ensure cookies are enabled

### Images not uploading
- Verify Cloudinary credentials
- Check file size (max 10MB recommended)
- Ensure valid image format (JPG, PNG, WEBP)

## 📝 Production Deployment (Vercel)

### Environment Variables

Add all environment variables to Vercel:

1. Go to Project Settings → Environment Variables
2. Add each variable from `.env.local`
3. Change `NEXTAUTH_URL` to your production domain:
   ```
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

### MongoDB Network Access

1. Go to MongoDB Atlas
2. Network Access → IP Access List
3. Add `0.0.0.0/0` to allow Vercel's dynamic IPs
   (Or use Vercel's IP ranges for better security)

### Post-Deployment

1. Run the admin creation script against production:
   ```bash
   MONGODB_URI="your_production_uri" node scripts/create-admin.js
   ```

2. Test admin login at `https://your-domain.vercel.app/admin/login`

## 🎨 Customization

### Branding Colors

The admin dashboard uses your brand colors:
- Primary: `#0F5132` (Deep Green)
- Accent: `#C9A227` (Gold)
- Dark: `#093822`

To change colors, update Tailwind classes in admin components.

### Admin Logo

Update the logo in `src/components/admin/AdminSidebar.js`

## 📞 Support

For issues or questions:
- Check the troubleshooting section above
- Review error logs in browser console
- Check MongoDB Atlas logs
- Verify all environment variables are set correctly

## ✅ Checklist Before Going Live

- [ ] NEXTAUTH_SECRET is a strong random string
- [ ] Cloudinary account configured
- [ ] Admin user created successfully
- [ ] All environment variables added to Vercel
- [ ] MongoDB allows Vercel IPs
- [ ] Test admin login on production
- [ ] Test product creation and image upload
- [ ] Test enquiry submission and viewing
- [ ] Verify public website displays database content
- [ ] Backup strategy in place for MongoDB

## 🔄 Next Steps

After setup:

1. Create product categories (Spices, Pulses, Millets, etc.)
2. Add products with images and descriptions
3. Publish products to make them visible on website
4. Test contact form submissions
5. Review and respond to enquiries
6. Configure website content sections
7. Upload hero images and company photos

---

**Note**: Keep your `.env.local` file secure and never commit it to version control!
