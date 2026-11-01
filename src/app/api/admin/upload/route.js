import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Max 8 MB
const MAX_SIZE = 8 * 1024 * 1024;
const ALLOWED  = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file     = formData.get('file');
    const folder   = formData.get('folder') || 'umglobal-products';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Unsupported file type: ${file.type}. Use JPEG, PNG, WEBP, or GIF.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    if (bytes.byteLength > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'File exceeds 8 MB limit.' }, { status: 400 });
    }

    // Convert to base64 data URI for Cloudinary
    const base64 = Buffer.from(bytes).toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await uploadToCloudinary(dataUri, folder);

    return NextResponse.json({ success: true, url: result.url, publicId: result.publicId });
  } catch (err) {
    console.error('[POST /api/admin/upload]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Upload failed.' },
      { status: err.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
