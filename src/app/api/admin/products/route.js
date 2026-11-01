import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

// GET  /api/admin/products
export async function GET(request) {
  try {
    await requireAdmin();
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page     = Math.max(1, parseInt(searchParams.get('page')   || '1'));
    const limit    = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const skip     = (page - 1) * limit;
    const search   = (searchParams.get('search')   || '').trim();
    const status   = searchParams.get('status')   || '';
    const category = searchParams.get('category') || '';
    const featured = searchParams.get('featured') || '';

    const query = {};
    if (search) {
      const esc = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: esc, $options: 'i' } },
        { shortDescription: { $regex: esc, $options: 'i' } },
      ];
    }
    if (status   === 'published' || status   === 'draft') query.status    = status;
    if (category) query.category  = category;
    if (featured  === 'true')  query.isFeatured = true;
    if (featured  === 'false') query.isFeatured = false;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[GET /api/admin/products]', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products.' },
      { status: err.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST /api/admin/products
export async function POST(request) {
  try {
    await requireAdmin();
    await dbConnect();

    const body = await request.json();
    const {
      name, slug, category, shortDescription, fullDescription,
      mainImage, additionalImages, specifications, origin,
      packagingInfo, availablePackagingSizes, minimumOrderQuantity,
      isFeatured, status, varieties, seo,
    } = body;

    if (!name?.trim())     return NextResponse.json({ success: false, error: 'Product name is required.' }, { status: 400 });
    if (!category)          return NextResponse.json({ success: false, error: 'Category is required.' },     { status: 400 });

    // Auto-generate slug if not supplied
    const finalSlug = slug?.trim()
      || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Slug uniqueness check
    const exists = await Product.findOne({ slug: finalSlug });
    if (exists) {
      return NextResponse.json({ success: false, error: 'A product with this slug already exists.' }, { status: 409 });
    }

    const product = await Product.create({
      name: name.trim(), slug: finalSlug, category,
      shortDescription, fullDescription,
      mainImage, additionalImages: additionalImages || [],
      specifications, origin, packagingInfo,
      availablePackagingSizes: availablePackagingSizes || [],
      minimumOrderQuantity, isFeatured: Boolean(isFeatured),
      status: status || 'draft',
      varieties: varieties || [], seo,
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/products]', err);
    if (err.code === 11000) {
      return NextResponse.json({ success: false, error: 'Slug already exists.' }, { status: 409 });
    }
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create product.' },
      { status: err.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
