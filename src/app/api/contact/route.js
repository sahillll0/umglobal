import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import dbConnect from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';

// Server-side only — never referenced on the client
const resend = new Resend(process.env.RESEND_API_KEY);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildFromAddress(displayName, emailAddress) {
  return `${displayName} <${emailAddress}>`;
}

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

// ---------------------------------------------------------------------------
// POST /api/contact
// ---------------------------------------------------------------------------
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      name,
      company,
      email,
      phone,
      product,
      quantity,
      port,
      message,
      formType = 'quote'
    } = body;

    // ── Validation ────────────────────────────────────────────────────────
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name is required.' },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const allowedFormTypes = ['contact', 'quote', 'product'];
    if (!allowedFormTypes.includes(formType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid form type.' },
        { status: 400 }
      );
    }

    // ── Save to database FIRST ────────────────────────────────────────────
    // The pre('save') hook on the Enquiry model generates the enquiryId
    // automatically, so we never set it manually here.
    const enquiry = new Enquiry({
      name:       name.trim(),
      company:    company?.trim() || undefined,
      email:      email.trim().toLowerCase(),
      phone:      phone?.trim() || undefined,
      product:    product?.trim() || undefined,
      quantity:   quantity?.trim() || undefined,
      port:       port?.trim() || undefined,
      message:    message?.trim() || undefined,
      formType,
      sourcePage: request.headers.get('referer') || 'Direct',
      ipAddress:  request.headers.get('x-forwarded-for')?.split(',')[0].trim()
                  || request.headers.get('x-real-ip')
                  || undefined,
      userAgent:  request.headers.get('user-agent') || undefined,
      status:     'new'
    });

    await enquiry.save();

    // ── Email notifications (non-blocking — never fail the request) ───────
    const recipientEmail    = process.env.OWNER_EMAIL || 'export@umglobalexim.com';
    const resendFromEmail   = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const ownerFromAddress  = process.env.RESEND_OWNER_FROM
                              || buildFromAddress('UM Global Exim', resendFromEmail);
    const customerFromAddress = process.env.RESEND_CUSTOMER_FROM
                              || buildFromAddress('UM Global Exim Desk', resendFromEmail);

    const isQuote = formType === 'quote';

    const safeName     = escapeHtml(name);
    const safeCompany  = escapeHtml(company  || 'Not specified');
    const safeEmail    = escapeHtml(email);
    const safePhone    = escapeHtml(phone    || '');
    const safeProduct  = escapeHtml(product  || 'our export products');
    const safeQuantity = escapeHtml(quantity || '');
    const safePort     = escapeHtml(port     || '');
    const safeMessage  = escapeHtml(message  || '').replace(/\n/g, '<br>');

    const subjectTitle = isQuote
      ? `[NEW B2B QUOTE REQUEST] ${product || 'Agro Products'} - ${company || name}`
      : `[NEW CONTACT INQUIRY] from ${name} (${company || 'B2B Buyer'})`;

    const ownerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 620px; background: #ffffff; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #0F5132 0%, #093822 100%); padding: 28px 32px; color: #ffffff; }
          .badge { display: inline-block; background: #C9A227; color: #093822; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
          .content { padding: 32px; }
          .info-table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px; }
          .info-table td { padding: 12px 14px; border-bottom: 1px solid #edf2f7; font-size: 14px; }
          .info-table td.label { font-weight: 700; color: #0F5132; width: 35%; background: #f8fafc; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
          .message-box { background: #f8fafc; border-left: 4px solid #C9A227; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #334155; }
          .cta-btn { display: inline-block; background: #0F5132; color: #ffffff !important; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; margin-top: 16px; }
          .footer { background: #072718; color: #94a3b8; padding: 18px 32px; text-align: center; font-size: 12px; border-top: 1px solid #1e293b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="badge">${isQuote ? 'Official Quote Request' : 'Direct Inquiry'}</div>
            <h1>${subjectTitle}</h1>
            <p style="margin:6px 0 0 0;font-size:13px;color:#a7f3d0;">Enquiry ID: ${enquiry.enquiryId} • Submitted via UM Global Exim Website</p>
          </div>
          <div class="content">
            <p style="font-size:15px;margin-top:0;">New trade inquiry from <strong>${safeName}</strong>.</p>
            <table class="info-table">
              <tr><td class="label">Full Name</td><td><strong>${safeName}</strong></td></tr>
              <tr><td class="label">Company</td><td>${safeCompany}</td></tr>
              <tr><td class="label">Email</td><td><a href="mailto:${safeEmail}" style="color:#0F5132;font-weight:600;">${safeEmail}</a></td></tr>
              <tr><td class="label">Phone / WhatsApp</td><td>${phone ? `<a href="tel:${safePhone}">${safePhone}</a>` : 'Not provided'}</td></tr>
              ${product  ? `<tr><td class="label">Product</td><td><span style="background:#e6f4ea;color:#0F5132;padding:3px 8px;border-radius:6px;font-weight:700;font-size:12px;">${safeProduct}</span></td></tr>` : ''}
              ${quantity ? `<tr><td class="label">Quantity</td><td><strong>${safeQuantity}</strong></td></tr>` : ''}
              ${port     ? `<tr><td class="label">Destination Port</td><td>${safePort}</td></tr>` : ''}
              <tr><td class="label">Submission Date</td><td>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td></tr>
            </table>
            ${message ? `<div style="margin-top:20px;"><strong style="font-size:12px;color:#475569;display:block;margin-bottom:6px;">Message:</strong><div class="message-box">${safeMessage}</div></div>` : ''}
            <div style="text-align:center;margin-top:28px;">
              <a href="mailto:${safeEmail}?subject=RE: ${encodeURIComponent(subjectTitle)}" class="cta-btn">Reply to ${safeName}</a>
            </div>
          </div>
          <div class="footer">UM Global Exim Private Limited • Government Recognized Indian Export House</div>
        </div>
      </body>
      </html>
    `;

    // Send to owner — log errors but do not fail the request
    let ownerEmailSent = false;
    try {
      const { data, error } = await resend.emails.send({
        from:    ownerFromAddress,
        to:      [recipientEmail],
        replyTo: email,
        subject: subjectTitle,
        html:    ownerEmailHtml
      });
      if (error) {
        console.error('[Resend owner email error]:', error);
      } else {
        ownerEmailSent = Boolean(data?.id);
      }
    } catch (emailErr) {
      console.error('[Resend owner email exception]:', emailErr);
    }

    // Send confirmation to customer — optional, never blocks the response
    let customerConfirmationSent = false;
    let customerConfirmationWarning = '';
    try {
      const { data, error } = await resend.emails.send({
        from:    customerFromAddress,
        to:      [email],
        replyTo: recipientEmail,
        subject: 'Thank You for Contacting UM Global Exim',
        html: `
          <!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
          <style>
            body{font-family:'Segoe UI',sans-serif;background:#fff;color:#1e293b;margin:0;padding:0}
            .wrap{max-width:600px;margin:40px auto;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}
            .hdr{background:linear-gradient(135deg,#0F5132,#0a3d25);padding:40px 30px;text-align:center;color:#fff}
            .hdr .co{font-size:28px;font-weight:800;margin-bottom:6px}
            .hdr .tl{font-size:13px;color:#C9A227;font-weight:600}
            .body{padding:40px 30px;font-size:15px;line-height:1.8;color:#334155}
            .body p{margin:0 0 16px}
            .hi{color:#0F5132;font-weight:600}
            .box{background:#f8faf9;border-left:4px solid #C9A227;padding:18px 20px;margin:24px 0;border-radius:4px;font-size:14px}
            .sig{margin-top:32px;padding-top:24px;border-top:2px solid #e2e8f0}
            .ftr{background:#0F5132;padding:24px 30px;text-align:center;font-size:12px;color:#a7c4b5}
          </style>
          </head><body>
          <div class="wrap">
            <div class="hdr">
              <div class="co">UM Global Exim</div>
              <p class="tl">Premium Agricultural Products Exporter — India to the World</p>
            </div>
            <div class="body">
              <p>Dear <span class="hi">${safeName}</span>,</p>
              <p>Thank you for contacting <span class="hi">UM Global Exim</span>. We have received your enquiry and our export team will review it shortly.</p>
              <p>Your reference ID is: <strong>${enquiry.enquiryId}</strong></p>
              <div class="box">
                <p><strong>For immediate assistance:</strong></p>
                <p>Email: sales@umglobalexim.com</p>
                <p>We typically respond within 12–24 business hours.</p>
              </div>
              <div class="sig">
                <p>Best Regards,<br><strong>UM Global Exim</strong><br>
                <span style="font-size:13px;color:#64748b">Premium Agricultural Products Exporter from India</span></p>
              </div>
            </div>
            <div class="ftr">
              <strong>UM Global Exim Private Limited</strong><br>
              Government Recognized Indian Export House
            </div>
          </div>
          </body></html>
        `
      });
      if (error) {
        customerConfirmationWarning = resendFromEmail === 'onboarding@resend.dev'
          ? 'Confirmation email not delivered — add a verified RESEND_FROM_EMAIL in your environment settings.'
          : error.message;
        console.warn('[Resend customer email error]:', error);
      } else {
        customerConfirmationSent = Boolean(data?.id);
      }
    } catch (confirmErr) {
      console.warn('[Resend customer email exception]:', confirmErr);
      customerConfirmationWarning = confirmErr.message || 'Customer confirmation email could not be delivered.';
    }

    return NextResponse.json({
      success: true,
      message: customerConfirmationSent
        ? 'Inquiry submitted successfully. A confirmation email has been sent to you.'
        : 'Inquiry submitted successfully. Our team will contact you soon.',
      enquiryId: enquiry.enquiryId,
      customerConfirmationSent,
      ...(customerConfirmationWarning && { warning: customerConfirmationWarning })
    });

  } catch (error) {
    console.error('[POST /api/contact]:', error);

    // Return a clean message — never leak internal details
    return NextResponse.json(
      { success: false, error: 'Failed to submit your inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
