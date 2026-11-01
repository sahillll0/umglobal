import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

function validId(id) { return mongoose.Types.ObjectId.isValid(id); }

// GET /api/admin/products/[id]
export async function GET(request, context) {
  try {
    await requireAdmin();
    await dbConnect();
    const { id } = await context.params;
    if (!validId(id)) return NextResponse.json({ success: false, error: 'Invalid ID.' }, { status: 400 });

    const product = await Product.findById(id).populate('category', 'name slug').lean();
    if (!product) return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error('[GET /api/admin/products/:id]', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch product.' }, { status: 500 });
  }
}

// PATCH /api/admin/products/[id]
export async function PATCH(request, context) {
  try {
    await requireAdmin();
    await dbConnect();
    const { id } = await context.params;
    if (!validId(id)) return NextResponse.json({ success: false, error: 'Invalid ID.' }, { status: 400 });

    const body = await request.json();

    // Prevent slug collision when changing slug
    if (body.slug) {
      const conflict = await Product.findOne({ slug: body.slug, _id: { $ne: id } });
      if (conflict) return NextResponse.json({ success: false, error: 'Slug already in use.' }, { status: 409 });
    }

    const product = await Product.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true })
      .populate('category', 'name slug');
    if (!product) return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error('[PATCH /api/admin/products/:id]', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to update product.' }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(request, context) {
  try {
    await requireAdmin();
    await dbConnect();
    const { id } = await context.params;
    if (!validId(id)) return NextResponse.json({ success: false, error: 'Invalid ID.' }, { status: 400 });

    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    console.error('[DELETE /api/admin/products/:id]', err);
    return NextResponse.json({ success: false, error: 'Failed to delete product.' }, { status: 500 });
  }
}
