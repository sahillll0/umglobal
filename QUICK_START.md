# 🚀 UM Global Exim Admin Dashboard - Quick Start Guide

## ⚡ Get Started in 5 Minutes

### Step 1: Install Dependencies (Already Done ✅)

```bash
npm install
```

### Step 2: Configure Environment Variables

Create or update `.env.local` with these settings:

```env
# MongoDB (Already Configured ✅)
MONGODB_URI="your_mongodb_connection_string_here"

# Email Service (Already Configured ✅)
RESEND_API_KEY="your_resend_api_key"
OWNER_EMAIL="your_email@example.com"

# NextAuth Authentication (REQUIRED - Generate Now)
NEXTAUTH_SECRET="GENERATE_A_RANDOM_32_CHARACTER_STRING_HERE"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary Image Storage (REQUIRED for image uploads)
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

**Generate NEXTAUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and paste it as your `NEXTAUTH_SECRET`.

**Get Cloudinary Credentials (Free):**
1. Sign up at https://cloudinary.com
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Paste them into `.env.local`

### Step 3: Create Your First Admin Account

```bash
node scripts/create-admin.js
```

Follow the prompts:
- Enter your name (e.g., "John Doe")
- Enter your email (e.g., "admin@umglobalexim.com")
- Create a strong password (minimum 8 characters)
- Confirm password

You'll see: ✅ **Admin account created successfully!**

### Step 4: Start Development Server

```bash
npm run dev
```

Server starts at: http://localhost:3000

### Step 5: Login to Admin Dashboard

1. Open browser: http://localhost:3000/admin/login
2. Enter your email and password
3. Click "Sign In to Dashboard"

**Welcome to your Admin Dashboard!** 🎉

---

## 🎯 What You Can Do Right Now

### ✅ Available Features:

1. **Dashboard** (`/admin`)
   - View statistics
   - See recent enquiries
   - Monitor activity

2. **Enquiries Management** (`/admin/enquiries`)
   - View all customer enquiries
   - Filter by status, date, product
   - Change enquiry status
   - Export to CSV
   - Search customers

3. **Test Contact Form**
   - Go to: http://localhost:3000/contact
   - Submit a test enquiry
   - Check it appears in admin dashboard

---

## 🔧 What's Next?

The following features are ready for implementation but not yet built:

### Coming Soon:
- **Products Management** - Add, edit, delete products with images
- **Categories Management** - Manage product categories
- **Website Content Editor** - Edit homepage, about us, etc.
- **Media Library** - Upload and manage images
- **Reports & Analytics** - Business insights

---

## 🐛 Troubleshooting

### "Cannot connect to database"
✅ **Fix:** Check your `MONGODB_URI` is correct in `.env.local`

### "Admin login not working"
✅ **Fix:** 
1. Verify you created an admin account with the script
2. Check `NEXTAUTH_SECRET` is set
3. Restart the dev server

### "Missing environment variable"
✅ **Fix:** 
1. Copy all variables from `.env.local` template above
2. Replace placeholder values with actual credentials
3. Restart dev server: `Ctrl+C` then `npm run dev`

### "Image upload fails"
✅ **Fix:** Configure Cloudinary credentials in `.env.local`

---

## 📖 Documentation

- **Setup Guide:** `ADMIN_SETUP_GUIDE.md` - Detailed setup instructions
- **Implementation Status:** `IMPLEMENTATION_STATUS.md` - Complete feature list
- **This Guide:** `QUICK_START.md` - You are here!

---

## 🎨 Brand Colors

Your admin dashboard uses your company brand colors:
- Primary Green: `#0F5132`
- Gold Accent: `#C9A227`
- Dark Green: `#093822`

---

## 📞 Need Help?

1. Check `ADMIN_SETUP_GUIDE.md` for detailed instructions
2. Review `IMPLEMENTATION_STATUS.md` for feature status
3. Check browser console for errors (F12)
4. Verify all environment variables are set correctly

---

## ✅ Quick Checklist

Before you start developing:

- [ ] All dependencies installed (`npm install`)
- [ ] `.env.local` configured with all required variables
- [ ] `NEXTAUTH_SECRET` generated and added
- [ ] Cloudinary account created and credentials added
- [ ] First admin account created (`node scripts/create-admin.js`)
- [ ] Dev server running (`npm run dev`)
- [ ] Successfully logged into admin dashboard
- [ ] Test enquiry submitted and visible in dashboard

**Once all checked, you're ready to build! 🚀**

---

## 🎯 Recommended Development Order

1. **Week 1:** Test current features, familiarize with dashboard
2. **Week 2:** Implement Products Management (high priority)
3. **Week 3:** Implement Categories & Website Content
4. **Week 4:** Media Library & Reports
5. **Week 5:** Testing, optimization, and production deployment

---

**Happy Building! 🎉**

If you have questions, refer to the detailed guides:
- `ADMIN_SETUP_GUIDE.md` - Comprehensive setup
- `IMPLEMENTATION_STATUS.md` - Feature tracking
