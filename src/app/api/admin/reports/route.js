import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    await requireAdmin();
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const daysRaw = parseInt(searchParams.get('days') || '30');
    const days    = Math.min(Math.max(daysRaw, 1), 365);

    const since = new Date();
    since.setDate(since.getDate() - days);

    const [byStatus, byProduct, byCountry, daily] = await Promise.all([
      // Enquiries by status
      Enquiry.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      // Enquiries by product (top 10)
      Enquiry.aggregate([
        { $match: { product: { $ne: null, $ne: '' } } },
        { $group: { _id: '$product', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      // Enquiries by country (top 10)
      Enquiry.aggregate([
        { $match: { country: { $ne: null, $ne: '' } } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      // Daily enquiries over the period
      Enquiry.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      byStatus,
      byProduct,
      byCountry,
      daily,
      period: days,
    });
  } catch (err) {
    console.error('[GET /api/admin/reports]', err);
    return NextResponse.json({ success: false, error: 'Failed to load reports.' }, { status: err.message === 'Unauthorized' ? 401 : 500 });
  }
}
