import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

// Public — only returns published products
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category') || '';
    const featured     = searchParams.get('featured') === 'true';
    const limit        = Math.min(100, parseInt(searchParams.get('limit') || '50'));

    const query = { status: 'published' };
    if (featured) query.isFeatured = true;

    // If filtering by category slug we need to join
    let products;
    if (categorySlug) {
      products = await Product.find(query)
        .populate({ path: 'category', match: { slug: categorySlug }, select: 'name slug' })
        .sort({ sortOrder: 1, createdAt: -1 })
        .limit(limit)
        .lean();
      // populate with match still returns docs; filter out those whose category didn't match
      products = products.filter(p => p.category !== null);
    } else {
      products = await Product.find(query)
        .populate('category', 'name slug')
        .sort({ sortOrder: 1, createdAt: -1 })
        .limit(limit)
        .lean();
    }

    return NextResponse.json({ success: true, products }, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) {
    console.error('[GET /api/products]', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch products.' }, { status: 500 });
  }
}
