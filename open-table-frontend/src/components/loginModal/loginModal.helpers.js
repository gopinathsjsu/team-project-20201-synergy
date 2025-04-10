export const validatePhoneNumberFormat = (phoneNumber) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Basic international format, e.g., +1234567890
  return phoneRegex.test(phoneNumber);
};

export const validateEmailFormat = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
