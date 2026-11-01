import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function PATCH(request) {
  try {
    const session = await requireAdmin();
    await dbConnect();
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Both fields are required.' }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: 'New password must be at least 8 characters.' }, { status: 400 });
    }

    const admin = await Admin.findById(session.user.id);
    if (!admin) return NextResponse.json({ success: false, error: 'Admin not found.' }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) return NextResponse.json({ success: false, error: 'Current password is incorrect.' }, { status: 400 });

    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('[PATCH /api/admin/settings/password]', err);
    return NextResponse.json({ success: false, error: 'Failed to update password.' }, { status: err.message === 'Unauthorized' ? 401 : 500 });
  }
}
