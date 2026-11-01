import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import WebsiteContent from '@/models/WebsiteContent';

export async function GET() {
  try {
    await dbConnect();
    const docs = await WebsiteContent.find({ isPublished: true }).lean();
    const map  = Object.fromEntries(docs.map(d => [d.section, d.content]));
    return NextResponse.json({ success: true, content: map }, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch content.' }, { status: 500 });
  }
}
