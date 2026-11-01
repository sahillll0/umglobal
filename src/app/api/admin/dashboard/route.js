import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Enquiry from '@/models/Enquiry';

export async function GET(request) {
  try {
    // Verify admin authentication
    await requireAdmin();

    await dbConnect();

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get this month's date range
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    // Fetch statistics
    const [
      totalProducts,
      publishedProducts,
      draftProducts,
      totalEnquiries,
      newEnquiries,
      todayEnquiries,
      monthEnquiries,
      recentEnquiries
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'published' }),
      Product.countDocuments({ status: 'draft' }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      Enquiry.countDocuments({ 
        createdAt: { $gte: today, $lt: tomorrow } 
      }),
      Enquiry.countDocuments({ 
        createdAt: { $gte: startOfMonth, $lte: endOfMonth } 
      }),
      Enquiry.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('enquiryId name email company product status createdAt')
        .lean()
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        publishedProducts,
        draftProducts,
        totalEnquiries,
        newEnquiries,
        todayEnquiries,
        monthEnquiries
      },
      recentEnquiries
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch dashboard data' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
