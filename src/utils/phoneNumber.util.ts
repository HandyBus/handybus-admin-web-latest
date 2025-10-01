/**
 * Formats a phone number string to display format (010-1234-5678)
 * @param phoneNumber - Raw phone number string (only digits)
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const digits = phoneNumber.replace(/\D/g, '');

  const limitedDigits = digits.slice(0, 11);

  if (limitedDigits.length <= 3) {
    return limitedDigits;
  } else if (limitedDigits.length <= 7) {
    return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`;
  } else {
    return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3, 7)}-${limitedDigits.slice(7)}`;
  }
};

/**
 * Converts a formatted phone number to international format (+821012345678)
 * @param phoneNumber - Phone number string (formatted or raw)
 * @returns International format phone number string
 */
export const convertToInternationalFormat = (phoneNumber: string): string => {
  const digits = phoneNumber.replace(/\D/g, '');

  if (digits.startsWith('010')) {
    return `+82${digits.slice(1)}`;
  }

  if (digits.startsWith('82')) {
    return `+${digits}`;
  }

  if (digits.startsWith('+82')) {
    return digits;
  }

  return `+82${digits}`;
};

/**
 * Validates if the input contains only digits and common phone number characters
 * @param value - Input value to validate
 * @returns True if valid phone number input
 */
export const isValidPhoneNumberInput = (value: string): boolean => {
  return /^[\d\s\-+]*$/.test(value);
};
