import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import mongoose from 'mongoose';

function validId(id) { return mongoose.Types.ObjectId.isValid(id); }

export async function GET(request, context) {
  try {
    await requireAdmin(); await dbConnect();
    const { id } = await context.params;
    if (!validId(id)) return NextResponse.json({ success: false, error: 'Invalid ID.' }, { status: 400 });
    const category = await Category.findById(id).lean();
    if (!category) return NextResponse.json({ success: false, error: 'Category not found.' }, { status: 404 });
    return NextResponse.json({ success: true, category });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch category.' }, { status: 500 });
  }
}

export async function PATCH(request, context) {
  try {
    await requireAdmin(); await dbConnect();
    const { id } = await context.params;
    if (!validId(id)) return NextResponse.json({ success: false, error: 'Invalid ID.' }, { status: 400 });
    const body = await request.json();
    if (body.slug) {
      const conflict = await Category.findOne({ slug: body.slug, _id: { $ne: id } });
      if (conflict) return NextResponse.json({ success: false, error: 'Slug already in use.' }, { status: 409 });
    }
    const category = await Category.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!category) return NextResponse.json({ success: false, error: 'Category not found.' }, { status: 404 });
    return NextResponse.json({ success: true, category });
  } catch (err) {
    console.error('[PATCH /api/admin/categories/:id]', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to update.' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    await requireAdmin(); await dbConnect();
    const { id } = await context.params;
    if (!validId(id)) return NextResponse.json({ success: false, error: 'Invalid ID.' }, { status: 400 });

    // Safety check — block delete if products are assigned
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete: ${productCount} product(s) are assigned to this category. Re-assign them first.` },
        { status: 409 }
      );
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) return NextResponse.json({ success: false, error: 'Category not found.' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    console.error('[DELETE /api/admin/categories/:id]', err);
    return NextResponse.json({ success: false, error: 'Failed to delete category.' }, { status: 500 });
  }
}
