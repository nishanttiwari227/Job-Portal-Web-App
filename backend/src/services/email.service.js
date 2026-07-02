import { Resend } from 'resend';
import resendConfig from '../config/resend.js';
import env from '../config/env.js';
import { buildVerificationEmail } from '../utils/emailTemplates.js';
import ApiError from '../utils/apiError.js';
import logger from '../utils/logger.js';

let resendClient = null;

const getResendClient = () => {
  if (!resendConfig.enabled) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(resendConfig.apiKey);
  }

  return resendClient;
};

const sendVerificationEmail = async ({ to, name, verificationUrl }) => {
  const { subject, html, text } = buildVerificationEmail({ name, verificationUrl });
  const resend = getResendClient();

  if (!resend) {
    if (env.nodeEnv === 'development') {
      logger.info(`[DEV] Verification email for ${to}: ${verificationUrl}`);
      return;
    }

    throw ApiError.internal('Email service is not configured');
  }

  const { error } = await resend.emails.send({
    from: resendConfig.fromEmail,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    logger.error('Failed to send verification email:', error.message);
    throw ApiError.internal('Unable to send verification email');
  }
};

export { sendVerificationEmail };
