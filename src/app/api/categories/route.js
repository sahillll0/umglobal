import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({ isPublished: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();
    return NextResponse.json({ success: true, categories }, {
      headers: { 'Cache-Control': 's-maxage=120, stale-while-revalidate=600' },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch categories.' }, { status: 500 });
  }
}
