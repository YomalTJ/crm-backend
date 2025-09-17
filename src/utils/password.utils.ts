import zxcvbn = require('zxcvbn');
import * as owasp from 'owasp-password-strength-test';

const COMMON_PASSWORDS = [
  '123456',
  'password',
  'admin123',
  '12345678',
  'qwerty',
  'iloveyou',
];

export function validatePasswordRules(
  password: string,
  userInfo: string[] = [],
) {
  const errors: string[] = [];

  // Length & complexity (OWASP)
  const owaspResult = owasp.test(password);
  if (!owaspResult.strong) {
    errors.push(...owaspResult.errors);
  }

  // Custom: No >2 identical characters in a row
  if (/(\w)\1\1/.test(password)) {
    errors.push(
      'Password cannot contain more than 2 repeated characters in a row.',
    );
  }

  // Disallow common passwords
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('Password is too common.');
  }

  // Disallow user-related values
  userInfo.forEach((info) => {
    if (password.toLowerCase().includes(info.toLowerCase())) {
      errors.push('Password should not contain personal information.');
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    strength: zxcvbn(password).score, // 0 to 4
  };
}
