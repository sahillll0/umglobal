import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';

export async function GET(request) {
  try {
    await requireAdmin();
    await dbConnect();

    const { searchParams } = new URL(request.url);

    // ── Pagination ────────────────────────────────────────────────────────
    const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const skip  = (page - 1) * limit;

    // ── Filters ───────────────────────────────────────────────────────────
    const query = {};

    const search = (searchParams.get('search') || '').trim();
    if (search) {
      // Escape special regex characters to prevent ReDoS
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name:      { $regex: escaped, $options: 'i' } },
        { email:     { $regex: escaped, $options: 'i' } },
        { company:   { $regex: escaped, $options: 'i' } },
        { phone:     { $regex: escaped, $options: 'i' } },
        { enquiryId: { $regex: escaped, $options: 'i' } },
      ];
    }

    const status = searchParams.get('status');
    const validStatuses = ['new','contacted','in_progress','quoted','converted','closed','spam'];
    if (status && validStatuses.includes(status)) {
      query.status = status;
    }

    const product = (searchParams.get('product') || '').trim();
    if (product) {
      const escaped = product.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.product = { $regex: escaped, $options: 'i' };
    }

    const country = (searchParams.get('country') || '').trim();
    if (country) {
      const escaped = country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.country = { $regex: escaped, $options: 'i' };
    }

    const dateFrom = searchParams.get('dateFrom');
    const dateTo   = searchParams.get('dateTo');
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (!isNaN(from)) query.createdAt.$gte = from;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        if (!isNaN(to)) {
          to.setHours(23, 59, 59, 999);
          query.createdAt.$lte = to;
        }
      }
    }

    // ── Sort ──────────────────────────────────────────────────────────────
    const sortDir = searchParams.get('sort') === 'asc' ? 1 : -1;

    // ── Fetch ─────────────────────────────────────────────────────────────
    const [enquiries, total] = await Promise.all([
      Enquiry.find(query)
        .sort({ createdAt: sortDir })
        .skip(skip)
        .limit(limit)
        .lean(),
      Enquiry.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      enquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[GET /api/admin/enquiries]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enquiries.' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
