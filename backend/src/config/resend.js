import env from './env.js';

/**
 * Resend email config placeholder — wire up when transactional email is implemented.
 */
const resendConfig = {
  apiKey: env.resend.apiKey,
  fromEmail: env.resend.fromEmail,
  enabled: Boolean(env.resend.apiKey && env.resend.fromEmail),
};

export default resendConfig;
