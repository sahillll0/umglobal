import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import mongoose from 'mongoose';

// ── helpers ───────────────────────────────────────────────────────────────────

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ── GET /api/admin/enquiries/[id] ─────────────────────────────────────────────

export async function GET(request, context) {
  try {
    await requireAdmin();
    await dbConnect();

    // Next.js 15/16 App Router: params is a Promise — must be awaited
    const { id } = await context.params;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid enquiry ID.' },
        { status: 400 }
      );
    }

    const enquiry = await Enquiry.findById(id).lean();
    if (!enquiry) {
      return NextResponse.json(
        { success: false, error: 'Enquiry not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, enquiry });
  } catch (error) {
    console.error('[GET /api/admin/enquiries/:id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enquiry.' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// ── PATCH /api/admin/enquiries/[id] ──────────────────────────────────────────

export async function PATCH(request, context) {
  try {
    const session = await requireAdmin();
    await dbConnect();

    // Next.js 15/16 App Router: params is a Promise — must be awaited
    const { id } = await context.params;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid enquiry ID.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, note } = body;

    const validStatuses = [
      'new', 'contacted', 'in_progress', 'quoted', 'converted', 'closed', 'spam',
    ];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value.' },
        { status: 400 }
      );
    }

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return NextResponse.json(
        { success: false, error: 'Enquiry not found.' },
        { status: 404 }
      );
    }

    // ── Update status ────────────────────────────────────────────────────────
    if (status && status !== enquiry.status) {
      // Record the previous status before overwriting
      enquiry.statusHistory.push({
        status:    enquiry.status,
        changedBy: session.user.id,
        changedAt: new Date(),
      });
      enquiry.status = status;
    }

    // ── Add internal note ────────────────────────────────────────────────────
    if (note && note.trim()) {
      enquiry.notes.push({
        content:  note.trim(),
        addedBy:  session.user.id,
        addedAt:  new Date(),
      });
    }

    await enquiry.save();

    // Return plain object so the client doesn't need to handle Mongoose docs
    return NextResponse.json({ success: true, enquiry: enquiry.toObject() });
  } catch (error) {
    console.error('[PATCH /api/admin/enquiries/:id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update enquiry.' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
