import crypto from 'crypto';

const parseEmailVerificationToken = (token) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const separatorIndex = token.indexOf('.');

  if (separatorIndex === -1) {
    return null;
  }

  const userId = token.slice(0, separatorIndex);
  const randomPart = token.slice(separatorIndex + 1);

  if (!userId || !randomPart) {
    return null;
  }

  return { userId, token };
};

const generateEmailVerificationToken = (userId) => {
  const randomPart = crypto.randomBytes(32).toString('hex');
  return `${userId}.${randomPart}`;
};

export { generateEmailVerificationToken, parseEmailVerificationToken };
