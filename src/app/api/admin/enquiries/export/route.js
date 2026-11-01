import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import { format } from 'date-fns';

export async function GET(request) {
  try {
    await requireAdmin();
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    // Build filters (same as enquiries list)
    const filters = {};
    
    const search = searchParams.get('search');
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const status = searchParams.get('status');
    if (status) filters.status = status;

    const product = searchParams.get('product');
    if (product) filters.product = { $regex: product, $options: 'i' };

    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    if (dateFrom || dateTo) {
      filters.createdAt = {};
      if (dateFrom) filters.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        filters.createdAt.$lte = endDate;
      }
    }

    // Fetch all matching enquiries
    const enquiries = await Enquiry.find(filters)
      .sort({ createdAt: -1 })
      .lean();

    // Generate CSV
    const headers = [
      'Enquiry ID',
      'Date',
      'Name',
      'Company',
      'Email',
      'Phone',
      'Product',
      'Quantity',
      'Destination Port',
      'Country',
      'Status',
      'Form Type',
      'Message'
    ];

    const rows = enquiries.map(enq => [
      enq.enquiryId,
      format(new Date(enq.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      enq.name,
      enq.company || '',
      enq.email,
      enq.phone || '',
      enq.product || '',
      enq.quantity || '',
      enq.port || '',
      enq.country || '',
      enq.status,
      enq.formType,
      (enq.message || '').replace(/"/g, '""')
    ]);

    // Escape CSV fields
    const escapeCSV = (field) => {
      if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
        return `"${field}"`;
      }
      return field;
    };

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="enquiries-${format(new Date(), 'yyyy-MM-dd')}.csv"`
      }
    });
  } catch (error) {
    console.error('Export enquiries error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to export enquiries' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
