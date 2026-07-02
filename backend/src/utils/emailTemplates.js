const buildVerificationEmail = ({ name, verificationUrl }) => {
  const subject = 'Verify your Job Portal account';

  const text = [
    `Hi ${name},`,
    '',
    'Thanks for signing up for Job Portal.',
    'Please verify your email address by clicking the link below:',
    verificationUrl,
    '',
    'This link expires in 24 hours.',
    '',
    'If you did not create an account, you can safely ignore this email.',
  ].join('\n');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <p>Hi ${name},</p>
        <p>Thanks for signing up for Job Portal.</p>
        <p>Please verify your email address by clicking the button below:</p>
        <p>
          <a
            href="${verificationUrl}"
            style="display: inline-block; padding: 12px 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px;"
          >
            Verify Email
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link expires in 24 hours.</p>
        <p>If you did not create an account, you can safely ignore this email.</p>
      </body>
    </html>
  `;

  return { subject, html, text };
};

export { buildVerificationEmail };
