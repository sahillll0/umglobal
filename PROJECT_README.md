# UM Global Exim - Professional Business Website with Admin Dashboard

## 🌟 Project Overview

A complete Next.js 16 website for **UM Global Exim**, a government-recognized Indian agricultural export company specializing in spices, dehydrated products, pulses, millets, and fresh produce. The project includes a professional public-facing website and a comprehensive admin dashboard for managing products, customer enquiries, and website content.

---

## 🎯 Project Status

### ✅ Phase 1: FOUNDATION COMPLETE (100%)

**What's Working:**
- ✅ Professional export company website (public-facing)
- ✅ Secure admin authentication system
- ✅ Admin dashboard with real-time statistics
- ✅ Complete enquiry management system
- ✅ Database integration with MongoDB
- ✅ Email notifications with Resend
- ✅ Image upload infrastructure (Cloudinary)
- ✅ Responsive design for all devices

**What's Pending:**
- 📦 Products management UI (database model ready)
- 🗂️ Categories management UI (database model ready)
- 📝 Website content management system
- 🖼️ Media library interface
- 📊 Reports and analytics dashboards

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy and update `.env.local`:
```env
MONGODB_URI="your_mongodb_connection"
NEXTAUTH_SECRET="generate_with_openssl_or_node_crypto"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="your_resend_key"
OWNER_EMAIL="your_email"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Create First Admin
```bash
npm run create-admin
```

### 4. Start Development
```bash
npm run dev
```

### 5. Login
Navigate to: `http://localhost:3000/admin/login`

**📖 For detailed setup:** See `QUICK_START.md`

---

## 📂 Project Structure

```
umglobalexim/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin dashboard pages
│   │   │   ├── login/          # ✅ Admin login
│   │   │   ├── page.js         # ✅ Dashboard home
│   │   │   ├── enquiries/      # ✅ Enquiries management
│   │   │   ├── products/       # 📦 Products (placeholder)
│   │   │   ├── categories/     # 🗂️ Categories (placeholder)
│   │   │   ├── content/        # 📝 Content (placeholder)
│   │   │   ├── media/          # 🖼️ Media (placeholder)
│   │   │   ├── reports/        # 📊 Reports (placeholder)
│   │   │   └── settings/       # ⚙️ Settings (placeholder)
│   │   ├── api/
│   │   │   ├── admin/          # Admin API routes
│   │   │   ├── auth/           # ✅ NextAuth routes
│   │   │   └── contact/        # ✅ Contact form API
│   │   ├── about/              # About us page
│   │   ├── contact/            # Contact form page
│   │   ├── products/           # Product catalog pages
│   │   └── ...                 # Other public pages
│   ├── components/
│   │   ├── admin/              # ✅ Admin UI components
│   │   └── ...                 # Public website components
│   ├── lib/
│   │   ├── mongodb.js          # ✅ Database connection
│   │   ├── auth.js             # ✅ Auth helpers
│   │   └── cloudinary.js       # ✅ Image upload helpers
│   └── models/
│       ├── Admin.js            # ✅ Admin user model
│       ├── Product.js          # ✅ Product model
│       ├── Category.js         # ✅ Category model
│       ├── Enquiry.js          # ✅ Enquiry model
│       └── WebsiteContent.js   # ✅ CMS model
├── public/                     # Static assets
├── scripts/
│   └── create-admin.js         # ✅ Admin creation script
├── .env.local                  # Environment variables
├── QUICK_START.md              # 5-minute setup guide
├── ADMIN_SETUP_GUIDE.md        # Comprehensive setup guide
├── IMPLEMENTATION_STATUS.md    # Detailed feature tracking
└── PROJECT_README.md           # This file
```

---

## 🔐 Security Features

- **Password Hashing:** bcrypt with 12 salt rounds
- **Session Management:** JWT tokens with 24-hour expiry
- **Protected Routes:** Middleware guards all admin pages
- **Server-side Validation:** All operations validated on server
- **Environment Variables:** Secrets never exposed to client
- **MongoDB Security:** Connection string secured
- **Rate Limiting Ready:** Infrastructure prepared

---

## 🗄️ Database Schema

### Collections:

1. **admins** - Admin user accounts
   - Email, hashed password, role, active status
   - Last login tracking

2. **products** - Product catalog
   - Name, slug, category, descriptions
   - Multiple images (Cloudinary)
   - Specifications, packaging, pricing
   - SEO metadata, featured/published status

3. **categories** - Product categories
   - Name, slug, description, icon
   - Category image, badge text
   - Published status, product count

4. **enquiries** - Customer enquiries
   - Customer information (name, email, phone, company)
   - Product interest, quantity, destination
   - Status (new, contacted, in progress, quoted, converted, closed, spam)
   - Notes, status history
   - Timestamps, IP, user agent

5. **websitecontents** - Editable website sections
   - Homepage hero, about us, contact info
   - Global settings, footer content
   - Published status, edit history

---

## 🎨 Tech Stack

### Frontend:
- **Framework:** Next.js 16.2.12 (App Router)
- **UI Library:** React 19.2.4
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Animations:** Framer Motion

### Backend:
- **Database:** MongoDB Atlas with Mongoose
- **Authentication:** NextAuth.js (Credentials Provider)
- **Email:** Resend API
- **Image Storage:** Cloudinary
- **API:** Next.js API Routes

### Development:
- **Package Manager:** npm
- **Linting:** ESLint
- **Runtime:** Node.js 18+

---

## 📊 Admin Dashboard Features

### ✅ Working Features:

#### 1. Dashboard (`/admin`)
- Real-time statistics cards
- Product counts (total, published, draft)
- Enquiry metrics (total, new, today, this month)
- Recent enquiries table
- Quick navigation to all sections

#### 2. Enquiries Management (`/admin/enquiries`)
- Paginated table view (20 per page)
- Advanced search and filters:
  - Search by name, email, company, phone, enquiry ID
  - Filter by status, product, date range, country
- Status management with dropdown
- Detailed enquiry modal:
  - Customer information
  - Product details
  - Message display
  - Contact actions (email/phone links)
- CSV export with filters
- Status tracking and history
- Internal notes (infrastructure ready)

### 📦 Pending Features:

#### Products Management
- Add/edit products with forms
- Multiple image uploads
- Rich text descriptions
- Product specifications
- Category assignment
- Publish/unpublish control
- Featured product toggle
- SEO optimization

#### Categories Management
- Create and edit categories
- Category images
- Icon selection
- Sort order management
- Safe deletion checks

#### Website Content Management
- Editable homepage sections
- About us content editor
- Contact information manager
- Footer content editor
- Global settings (logo, company info)

#### Media Library
- Upload images
- Browse media grid
- Search and filter
- Copy URLs
- Delete unused files

#### Reports & Analytics
- Enquiries by date
- Enquiries by product/country
- Product performance
- Export to CSV/PDF

---

## 🌐 Public Website

### Current Pages:
- **Home** (`/`) - Hero, categories, CTA
- **About** (`/about`) - Company information
- **Products** (`/products`) - Product categories
- **Product Details** - Spices, pulses, millets, etc.
- **Quality Assurance** - Quality standards
- **Certifications** - Company certifications
- **Packaging & Logistics** - Export info
- **Export Markets** - Target markets
- **Contact** (`/contact`) - Enquiry form

### Integration Status:
- ✅ Contact form saves to database
- ✅ Email notifications working
- ✅ Responsive design complete
- 📦 Product display (currently static, will be dynamic)
- 📦 Categories (will load from database)
- 📝 Content sections (will be editable via CMS)

---

## 📧 Email Integration

### Resend API Configuration:
- Owner notification emails on enquiry submission
- Customer confirmation emails
- HTML email templates
- Error handling and fallbacks

### Email Features:
- Professional branded templates
- Automatic enquiry ID generation
- Customer contact details
- Product information included
- Reply-to addresses configured

---

## 🖼️ Image Management

### Cloudinary Integration:
- Configured upload helper functions
- Image transformation (1200x1200 limit)
- Auto quality optimization
- Multiple image upload support
- Secure deletion with public ID
- Ready for use in product/category management

### Image Storage:
- Free Cloudinary tier: 25GB storage
- Organized folders (umglobal-products, umglobal-categories)
- CDN delivery for fast loading
- Responsive image optimization

---

## 🧪 Testing

### Build Status:
```bash
npm run build
```
✅ Production build successful  
✅ No TypeScript errors  
✅ All routes compiled  

### Manual Testing Checklist:
- [x] Admin login/logout
- [x] Dashboard statistics display
- [x] Contact form submission
- [x] Enquiry list view
- [x] Enquiry filtering
- [x] Status change
- [x] CSV export
- [ ] Product CRUD (pending implementation)
- [ ] Image upload (infrastructure ready)
- [ ] Category management (pending)
- [ ] Content editing (pending)

---

## 📝 Environment Variables

### Required:
```env
# Database
MONGODB_URI="mongodb+srv://..."

# Authentication
NEXTAUTH_SECRET="..." # Generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Email
RESEND_API_KEY="re_..."
OWNER_EMAIL="your@email.com"

# Image Upload
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### Optional:
```env
# Custom from/to addresses for Resend
RESEND_FROM_EMAIL="..."
RESEND_OWNER_FROM="..."
RESEND_CUSTOMER_FROM="..."
```

---

## 🚀 Deployment

### Vercel Deployment:

1. **Environment Variables:**
   - Add all `.env.local` variables to Vercel
   - Change `NEXTAUTH_URL` to production domain

2. **MongoDB Access:**
   - Add Vercel IPs to MongoDB Atlas whitelist
   - Or use 0.0.0.0/0 (less secure but works with dynamic IPs)

3. **Domain Configuration:**
   - Configure custom domain in Vercel
   - Update `NEXTAUTH_URL` environment variable

4. **Initial Admin:**
   - Run create-admin script against production DB
   - Or use MongoDB Compass to create first admin

5. **Testing:**
   - Test admin login
   - Submit test enquiry
   - Verify email notifications

### Build Commands:
```bash
# Build command
npm run build

# Start command
npm start

# Development
npm run dev
```

---

## 📖 Documentation

- **`QUICK_START.md`** - Get started in 5 minutes
- **`ADMIN_SETUP_GUIDE.md`** - Comprehensive setup guide
- **`IMPLEMENTATION_STATUS.md`** - Feature tracking and roadmap
- **`PROJECT_README.md`** - This file (project overview)

---

## 🎯 Next Steps

### Immediate (Week 1-2):
1. Configure Cloudinary account
2. Create first admin user
3. Test current features thoroughly
4. Submit test enquiries
5. Verify email notifications

### Short Term (Week 3-4):
1. Implement products management UI
2. Build add/edit product forms
3. Integrate image uploads
4. Create product API routes
5. Test product creation flow

### Medium Term (Month 2):
1. Implement categories management
2. Build website content CMS
3. Create media library
4. Update public product pages to use database
5. Implement ISR for performance

### Long Term (Month 3+):
1. Reports and analytics
2. Admin settings and user management
3. Advanced features (bulk import, variants)
4. Performance optimization
5. Production deployment and monitoring

---

## 🐛 Troubleshooting

### Common Issues:

**Cannot login to admin:**
- Verify admin account created with `npm run create-admin`
- Check `NEXTAUTH_SECRET` is set
- Restart dev server after env changes

**Database connection fails:**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access
- Ensure database user has permissions

**Images not uploading:**
- Configure Cloudinary credentials
- Check file size limits
- Verify Cloudinary account is active

**Emails not sending:**
- Verify `RESEND_API_KEY` is correct
- Check Resend account status
- Review email logs in Resend dashboard

---

## 🔄 Version History

**v1.0.0 - Foundation Release (Current)**
- Admin authentication system
- Dashboard with statistics
- Enquiry management system
- Database models and API infrastructure
- Image upload configuration
- Email integration
- Documentation

**v1.1.0 - Products & Categories (Planned)**
- Product management UI
- Category management UI
- Image uploads implemented
- Public product pages updated

**v2.0.0 - Complete CMS (Planned)**
- Website content management
- Media library
- Reports and analytics
- Admin user management

---

## 📞 Support & Resources

### Documentation:
- Next.js: https://nextjs.org/docs
- MongoDB: https://www.mongodb.com/docs
- NextAuth.js: https://next-auth.js.org
- Cloudinary: https://cloudinary.com/documentation
- Resend: https://resend.com/docs

### Project-Specific:
- Check `ADMIN_SETUP_GUIDE.md` for detailed instructions
- Review `IMPLEMENTATION_STATUS.md` for feature status
- See inline code comments for implementation details

---

## ✅ Pre-Launch Checklist

### Development:
- [x] Admin authentication working
- [x] Dashboard functional
- [x] Enquiries management complete
- [x] Email notifications working
- [x] Database models created
- [ ] Products management implemented
- [ ] Categories management implemented
- [ ] Image uploads tested
- [ ] Public website integration complete

### Security:
- [x] Passwords hashed securely
- [x] Admin routes protected
- [x] Environment variables secured
- [x] Server-side validation
- [ ] Rate limiting configured
- [ ] HTTPS enforced in production

### Production:
- [ ] All environment variables set in Vercel
- [ ] MongoDB production access configured
- [ ] Cloudinary configured
- [ ] Admin accounts created
- [ ] Domain configured
- [ ] Email deliverability tested
- [ ] Performance optimized
- [ ] Backup strategy in place

---

## 📄 License

Proprietary - UM Global Exim Private Limited

---

**Built with ❤️ for UM Global Exim**  
*Premium Agricultural Products Exporter from India to the World*
