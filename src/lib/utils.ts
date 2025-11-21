import { randomBytes } from 'crypto';

export function generateCode(length = 6) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(length);
  let result = '';

  for (let i = 0; i < length; i += 1) {
    result += charset[bytes[i] % charset.length];
  }

  return result;
}

export function formatDate(value?: string | Date | null) {
  if (!value) {
    return '—';
  }

  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleString();
}

