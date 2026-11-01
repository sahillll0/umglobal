import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import WebsiteContent from '@/models/WebsiteContent';

const SECTIONS = [
  'homepage_hero','homepage_about','homepage_cta',
  'about_page','contact_info','global_settings','footer_content',
];

// GET /api/admin/content  — returns ALL sections at once (keyed by section name)
export async function GET() {
  try {
    await requireAdmin();
    await dbConnect();
    const docs = await WebsiteContent.find({}).lean();
    const map  = Object.fromEntries(docs.map(d => [d.section, d.content]));
    return NextResponse.json({ success: true, content: map });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch content.' }, { status: err.message === 'Unauthorized' ? 401 : 500 });
  }
}

// PATCH /api/admin/content  — upsert one section  { section, content }
export async function PATCH(request) {
  try {
    const session = await requireAdmin();
    await dbConnect();

    const { section, content } = await request.json();
    if (!section || !SECTIONS.includes(section)) {
      return NextResponse.json({ success: false, error: 'Invalid section name.' }, { status: 400 });
    }
    if (!content || typeof content !== 'object') {
      return NextResponse.json({ success: false, error: 'Content must be an object.' }, { status: 400 });
    }

    const doc = await WebsiteContent.findOneAndUpdate(
      { section },
      { $set: { content, lastEditedBy: session.user.id } },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, doc });
  } catch (err) {
    console.error('[PATCH /api/admin/content]', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to save content.' }, { status: err.message === 'Unauthorized' ? 401 : 500 });
  }
}
