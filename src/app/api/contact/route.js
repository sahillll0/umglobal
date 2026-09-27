import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with secret server-side API Key
const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function POST(request) {
  try {
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

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required fields.' },
        { status: 400 }
      );
    }

    const recipientEmail = process.env.OWNER_EMAIL || 'export@umglobalexim.com';
    const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const ownerFromAddress = process.env.RESEND_OWNER_FROM || buildFromAddress('UM Global Exim', resendFromEmail);
    const customerFromAddress = process.env.RESEND_CUSTOMER_FROM || buildFromAddress('UM Global Exim Desk', resendFromEmail);
    const isQuote = formType === 'quote';
    const isContact = formType === 'contact';
    const safeName = escapeHtml(name);
    const safeCompany = escapeHtml(company || 'Not specified');
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || '');
    const safeProduct = escapeHtml(product || 'our export products');
    const safeQuantity = escapeHtml(quantity || '');
    const safePort = escapeHtml(port || '');
    const safeMessage = escapeHtml(message || '').replace(/\n/g, '<br>');
    const subjectTitle = isQuote ? `[NEW B2B QUOTE REQUEST] ${product || 'Agro Products'} - ${company || name}` : `[NEW CONTACT INQUIRY] from ${name} (${company || 'B2B Buyer'})`;

    // HTML Email Template for Owner
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
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #a7f3d0;">Submitted via UM Global Exim Website Desk</p>
          </div>

          <div class="content">
            <p style="font-size: 15px; margin-top: 0;">You have received a new business trade inquiry from <strong>${safeName}</strong>.</p>
            
            <table class="info-table">
              <tr>
                <td class="label">Full Name</td>
                <td><strong>${safeName}</strong></td>
              </tr>
              <tr>
                <td class="label">Company Name</td>
                <td>${safeCompany}</td>
              </tr>
              <tr>
                <td class="label">Email Address</td>
                <td><a href="mailto:${safeEmail}" style="color: #0F5132; font-weight: 600;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td class="label">Phone / WhatsApp</td>
                <td>${phone ? `<a href="tel:${safePhone}">${safePhone}</a>` : 'Not provided'}</td>
              </tr>
              ${product ? `
              <tr>
                <td class="label">Product Category</td>
                <td><span style="background: #e6f4ea; color: #0F5132; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 12px;">${safeProduct}</span></td>
              </tr>` : ''}
              ${quantity ? `
              <tr>
                <td class="label">Estimated Quantity</td>
                <td><strong>${safeQuantity}</strong></td>
              </tr>` : ''}
              ${port ? `
              <tr>
                <td class="label">Destination Port</td>
                <td>${safePort}</td>
              </tr>` : ''}
              <tr>
                <td class="label">Submission Date</td>
                <td>${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} (IST)</td>
              </tr>
            </table>

            ${message ? `
            <div style="margin-top: 20px;">
              <strong style="font-size: 12px; uppercase; color: #475569; display: block; margin-bottom: 6px;">Requirements & Message:</strong>
              <div class="message-box">${safeMessage}</div>
            </div>` : ''}

            <div style="text-align: center; margin-top: 28px;">
              <a href="mailto:${safeEmail}?subject=RE: Quote Request - UM Global Exim&body=Hi ${encodeURIComponent(name)},%0D%0A%0D%0AThank you for contacting UM Global Exim regarding ${encodeURIComponent(product || 'our agricultural exports')}..." class="cta-btn">
                Reply Directly to ${safeName}
              </a>
            </div>
          </div>

          <div class="footer">
            UM Global Exim Private Limited • Government Recognized Indian Export House<br>
            Automated Notification Service • Resend Integration Active
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to site owner via Resend
    const { data: ownerEmailResult, error: ownerEmailError } = await resend.emails.send({
      from: ownerFromAddress,
      to: [recipientEmail],
      replyTo: email,
      subject: subjectTitle,
      html: ownerEmailHtml
    });

    if (ownerEmailError) {
      console.error('[Resend Error Owner Email]:', ownerEmailError);
      return NextResponse.json(
        { success: false, error: ownerEmailError.message || 'Failed to dispatch email notification.' },
        { status: 500 }
      );
    }

    let customerConfirmationSent = false;
    let customerConfirmationWarning = '';

    // Send automated customer confirmation email
    try {
      const { data: customerEmailResult, error: customerEmailError } = await resend.emails.send({
        from: customerFromAddress,
        to: [email],
        replyTo: recipientEmail,
        subject: 'Thank You for Contacting UM Global Exim',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Thank You for Contacting UM Global Exim</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background-color: #ffffff; 
                margin: 0; 
                padding: 0; 
                color: #1e293b; 
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              .email-wrapper { 
                width: 100%; 
                background-color: #ffffff; 
                padding: 40px 20px; 
              }
              .email-container { 
                max-width: 600px; 
                background: #ffffff; 
                margin: 0 auto; 
                border-radius: 0; 
                overflow: hidden; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
              }
              .email-header { 
                background: linear-gradient(135deg, #0F5132 0%, #0a3d25 100%); 
                padding: 40px 30px; 
                text-align: center;
                color: #ffffff; 
              }
              .email-header h1 { 
                margin: 0 0 8px 0; 
                font-size: 28px; 
                font-weight: 700; 
                color: #ffffff;
                letter-spacing: -0.5px;
              }
              .email-header .company-name {
                font-size: 32px;
                font-weight: 800;
                color: #ffffff;
                margin-bottom: 6px;
                letter-spacing: -0.8px;
              }
              .email-header .tagline { 
                margin: 0; 
                font-size: 13px; 
                color: #C9A227; 
                font-weight: 600;
                letter-spacing: 0.3px;
              }
              .email-body { 
                padding: 40px 30px; 
                line-height: 1.8; 
                font-size: 15px; 
                color: #334155;
                background-color: #ffffff;
              }
              .email-body p { 
                margin: 0 0 18px 0; 
              }
              .email-body p:last-child {
                margin-bottom: 0;
              }
              .greeting { 
                font-size: 17px; 
                font-weight: 600; 
                color: #0F5132; 
                margin-bottom: 20px !important;
              }
              .highlight { 
                color: #0F5132; 
                font-weight: 600; 
              }
              .contact-info {
                background-color: #f8faf9;
                border-left: 4px solid #C9A227;
                padding: 20px;
                margin: 28px 0;
                border-radius: 4px;
              }
              .contact-info p {
                margin: 0 0 8px 0;
                font-size: 14px;
                color: #475569;
              }
              .contact-info p:last-child {
                margin-bottom: 0;
              }
              .contact-info strong {
                color: #0F5132;
                font-weight: 600;
              }
              .signature {
                margin-top: 32px;
                padding-top: 24px;
                border-top: 2px solid #e2e8f0;
              }
              .signature p {
                margin: 0 0 4px 0;
                font-size: 15px;
              }
              .signature .regards {
                margin-bottom: 12px !important;
                color: #64748b;
              }
              .signature .company {
                font-weight: 700;
                font-size: 17px;
                color: #0F5132;
                margin-bottom: 2px !important;
              }
              .signature .subtitle {
                font-size: 13px;
                color: #64748b;
                font-weight: 500;
                margin-bottom: 8px !important;
              }
              .signature .email-link {
                color: #C9A227;
                text-decoration: none;
                font-weight: 600;
                font-size: 14px;
              }
              .signature .email-link:hover {
                text-decoration: underline;
              }
              .email-footer { 
                background-color: #0F5132; 
                padding: 28px 30px; 
                text-align: center; 
                font-size: 12px; 
                color: #a7c4b5;
                line-height: 1.6;
              }
              .email-footer p {
                margin: 0 0 6px 0;
              }
              .email-footer p:last-child {
                margin-bottom: 0;
              }
              .email-footer .footer-tagline {
                color: #C9A227;
                font-weight: 600;
                font-size: 13px;
                margin-top: 12px !important;
                font-style: italic;
              }
              @media only screen and (max-width: 600px) {
                .email-wrapper { padding: 20px 10px; }
                .email-header { padding: 30px 20px; }
                .email-header h1 { font-size: 24px; }
                .email-header .company-name { font-size: 26px; }
                .email-body { padding: 30px 20px; font-size: 14px; }
                .email-footer { padding: 24px 20px; }
              }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="email-container">
                
                <!-- Header -->
                <div class="email-header">
                  <div class="company-name">UM Global Exim</div>
                  <p class="tagline">Premium Agricultural Products Exporter From India to the World</p>
                </div>

                <!-- Body Content -->
                <div class="email-body">
                  <p class="greeting">Dear ${safeName},</p>
                  
                  <p>Thank you for contacting <span class="highlight">UM Global Exim</span>.</p>
                  
                  <p>We have successfully received your inquiry and appreciate your interest in our products and export solutions.</p>
                  
                  <p>Our team will review your requirements and get back to you as soon as possible.</p>
                  
                  <p>We look forward to connecting with you and exploring a successful business partnership.</p>

                  <!-- Contact Information Box -->
                  <div class="contact-info">
                    <p><strong>For immediate assistance:</strong></p>
                    <p>Email: <a href="mailto:sales@umglobalexim.com" class="email-link">sales@umglobalexim.com</a></p>
                    <p>Our export team typically responds within 12-24 business hours.</p>
                  </div>

                  <!-- Signature -->
                  <div class="signature">
                    <p class="regards">Best Regards,</p>
                    <p class="company">UM Global Exim</p>
                    <p class="subtitle">Premium Agricultural Products Exporter From India to the World</p>
                    <p><a href="mailto:sales@umglobalexim.com" class="email-link">sales@umglobalexim.com</a></p>
                  </div>
                </div>

                <!-- Footer -->
                <div class="email-footer">
                  <p><strong>UM Global Exim Private Limited</strong></p>
                  <p>Government Recognized Indian Export House</p>
                  <p class="footer-tagline">"Delivering Quality, Building Global Partnerships"</p>
                </div>

              </div>
            </div>
          </body>
          </html>
        `
      });

      if (customerEmailError) {
        customerConfirmationWarning = resendFromEmail === 'onboarding@resend.dev'
          ? 'Your inquiry was received, but the customer confirmation email could not be delivered. Configure RESEND_FROM_EMAIL with a verified sender address in Resend to send emails to customer inboxes.'
          : (customerEmailError.message || 'Customer confirmation email could not be delivered.');
        console.warn('[Customer Auto-Reply Error]:', customerEmailError);
      } else {
        customerConfirmationSent = Boolean(customerEmailResult?.id);
      }
    } catch (confirmErr) {
      console.warn('[Customer Auto-Reply Warning]:', confirmErr);
      customerConfirmationWarning = resendFromEmail === 'onboarding@resend.dev'
        ? 'Your inquiry was received, but the customer confirmation email could not be delivered. Configure RESEND_FROM_EMAIL with a verified sender address in Resend to send emails to customer inboxes.'
        : (confirmErr.message || 'Customer confirmation email could not be delivered.');
    }

    return NextResponse.json({
      success: true,
      message: customerConfirmationSent
        ? 'Inquiry submitted successfully. Notification sent to the owner and a confirmation email was sent to the customer.'
        : 'Inquiry submitted successfully and notification sent to the owner.',
      id: ownerEmailResult?.id,
      customerConfirmationSent,
      warning: customerConfirmationWarning || undefined
    });

  } catch (error) {
    console.error('[API /api/contact Exception]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while processing inquiry.' },
      { status: 500 }
    );
  }
}
