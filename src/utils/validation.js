/**
 * Validates an email address using a comprehensive regex pattern.
 * @param {string} email - The email address to validate.
 * @returns {Object} An object with:
 *    - isValid {boolean}: Whether the email is valid.
 *    - message {string}: An error message if invalid.
 */
export const validateEmail = (email) => {
  if (!email) return { isValid: false, message: 'Email is required' };

  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = re.test(String(email).toLowerCase());

  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid email address',
  };
};

/**
 * Validates password strength with multiple criteria.
 * Password must be at least 8 characters and meet a minimum strength score.
 * @param {string} password - The password to validate.
 * @returns {Object} An object with:
 *    - isValid {boolean}: Whether the password is valid.
 *    - message {string}: A message indicating the strength or error.
 *    - strength {number}: The strength score (0-5).
 */
export const validatePassword = (password) => {
  if (!password)
    return { isValid: false, message: 'Password is required', strength: 0 };

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);

  const strength =
    (hasMinLength ? 1 : 0) +
    (hasNumber ? 1 : 0) +
    (hasSpecialChar ? 1 : 0) +
    (hasUpper ? 1 : 0) +
    (hasLower ? 1 : 0);

  let message = '';
  if (!hasMinLength) {
    message = 'Password must be at least 8 characters';
  } else if (strength < 3) {
    message = 'Weak password';
  } else if (strength < 5) {
    message = 'Moderate password';
  } else {
    message = 'Strong password';
  }

  return {
    isValid: hasMinLength && strength >= 3,
    message,
    strength,
  };
};

/**
 * Validates an international phone number allowing various formats.
 * @param {string} phoneNumber - The phone number to validate.
 * @returns {Object} An object with:
 *    - isValid {boolean}: Whether the phone number is valid.
 *    - message {string}: An error message if invalid.
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber)
    return { isValid: false, message: 'Phone number is required' };

  // Supports international formats such as +1234567890, 1234567890, (123) 456-7890, etc.
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  const isValid = re.test(phoneNumber);

  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid phone number',
  };
};

/**
 * Validates a name, supporting international characters, apostrophes, hyphens, and spaces.
 * @param {string} name - The name to validate.
 * @returns {Object} An object with:
 *    - isValid {boolean}: Whether the name is valid.
 *    - message {string}: An error message if invalid.
 */
export const validateName = (name) => {
  if (!name) return { isValid: false, message: 'Name is required' };

  // Supports international characters, apostrophes, hyphens, and spaces
  const re = /^[\p{L}\s'-]{2,}$/u;
  const isValid = re.test(name.trim());

  return {
    isValid,
    message: isValid
      ? ''
      : 'Name must be at least 2 characters and contain only letters, spaces, hyphens, or apostrophes',
  };
};

/**
 * Validates order status against allowed values.
 * @param {string} status - The status to validate.
 * @returns {Object} An object with:
 *    - isValid {boolean}: Whether the status is valid.
 *    - message {string}: An error message if invalid.
 *    - normalizedStatus {string}: The validated and normalized status if valid.
 */
export const validateOrderStatus = (status) => {
  if (!status)
    return {
      isValid: false,
      message: 'Status is required',
      normalizedStatus: '',
    };

  const validStatuses = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ];

  const normalizedStatus = status.toLowerCase().trim();
  const isValid = validStatuses.includes(normalizedStatus);

  return {
    isValid,
    message: isValid
      ? ''
      : `Status must be one of: ${validStatuses.join(', ')}`,
    normalizedStatus: isValid ? normalizedStatus : '',
  };
};

/**
 * Validates a date string or object.
 * @param {string|Date} date - The date to validate.
 * @returns {Object} An object with:
 *    - isValid {boolean}: Whether the date is valid.
 *    - message {string}: An error message if invalid.
 *    - date {Date|null}: The parsed Date object if valid, otherwise null.
 */
export const validateDate = (date) => {
  if (!date) return { isValid: false, message: 'Date is required', date: null };

  const dateObj = new Date(date);
  const isValid = !isNaN(dateObj.getTime());

  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid date',
    date: isValid ? dateObj : null,
  };
};
