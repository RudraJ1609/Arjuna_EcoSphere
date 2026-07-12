import nodemailer from 'nodemailer';

export const sendOtpEmail = async (email: string, otp: string): Promise<boolean> => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.log(`[OTP Verification] Generating OTP for ${email}: ${otp}`);

  if (!host || !user || !pass) {
    console.warn(`[Mailer Warning] SMTP configuration is incomplete. Please configure SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_PORT in your environment variables. Falling back to secure terminal log delivery.`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"EcoSphere ESG Security" <${user}>`,
      to: email,
      subject: `[EcoSphere ESG] Secure One-Time Password (OTP) - ${otp}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; color: #1e293b;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0f3d2e; font-size: 28px; font-weight: 700; margin: 0;">EcoSphere ESG</h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Enterprise Sustainability Portal</p>
          </div>
          
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 30px; border: 1px solid #f1f5f9;">
            <p style="font-size: 14px; color: #475569; margin: 0 0 16px 0;">You requested a password reset. Use the secure, single-use 6-digit verification code below to authorize your identity:</p>
            <h2 style="font-size: 38px; font-family: monospace; letter-spacing: 6px; color: #0f3d2e; margin: 0; font-weight: 800;">${otp}</h2>
            <p style="font-size: 11px; color: #94a3b8; margin: 16px 0 0 0; text-transform: uppercase; font-weight: bold;">Expires in 5 minutes • Security Classification: Highly Restricted</p>
          </div>

          <p style="font-size: 12px; color: #64748b; line-height: 1.6; margin: 0 0 20px 0;">If you did not request this code, your account credentials might be compromised. Please notify your ESG Compliance Administrator immediately.</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          
          <div style="text-align: center; font-size: 11px; color: #94a3b8;">
            <p style="margin: 0 0 4px 0;">&copy; 2026 EcoSphere ESG. All rights reserved.</p>
            <p style="margin: 0;">ISO 27001 Certified Infrastructure &bull; Zero Trust Policy</p>
          </div>
        </div>
      `,
    });

    console.log(`[Mailer Success] OTP email successfully sent to ${email}. MessageId: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error(`[Mailer Error] Failed to send OTP email via SMTP to ${email}:`, err);
    return false;
  }
};
