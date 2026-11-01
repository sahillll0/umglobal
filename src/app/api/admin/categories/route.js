import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET(request) {
  try {
    await requireAdmin();
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true'; // ?all=true returns everything unpaginated

    if (all) {
      const categories = await Category.find({}).sort({ sortOrder: 1, name: 1 }).lean();
      return NextResponse.json({ success: true, categories });
    }

    const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const skip  = (page - 1) * limit;
    const search = (searchParams.get('search') || '').trim();

    const query = {};
    if (search) {
      const esc = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.name = { $regex: esc, $options: 'i' };
    }

    const [categories, total] = await Promise.all([
      Category.find(query).sort({ sortOrder: 1, name: 1 }).skip(skip).limit(limit).lean(),
      Category.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true, categories,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[GET /api/admin/categories]', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories.' }, { status: err.message === 'Unauthorized' ? 401 : 500 });
  }
}

export async function POST(request) {
  try {
    await requireAdmin();
    await dbConnect();
    const body = await request.json();
    const { name, slug, description, subtitle, image, icon, badge, sortOrder, isPublished, seo } = body;

    if (!name?.trim()) return NextResponse.json({ success: false, error: 'Category name is required.' }, { status: 400 });

    const finalSlug = slug?.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const exists = await Category.findOne({ slug: finalSlug });
    if (exists) return NextResponse.json({ success: false, error: 'A category with this slug already exists.' }, { status: 409 });

    const category = await Category.create({
      name: name.trim(), slug: finalSlug, description, subtitle,
      image, icon: icon || 'Package', badge,
      sortOrder: sortOrder ?? 0, isPublished: isPublished !== false, seo,
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/categories]', err);
    if (err.code === 11000) return NextResponse.json({ success: false, error: 'Category slug already exists.' }, { status: 409 });
    return NextResponse.json({ success: false, error: err.message || 'Failed to create category.' }, { status: err.message === 'Unauthorized' ? 401 : 500 });
  }
}
