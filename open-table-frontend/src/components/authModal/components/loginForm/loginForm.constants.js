import {
  validateEmailFormat,
  validatePhoneNumberFormat,
} from "./loginForm.helpers";

export const VERIFICATION_TYPE = {
  EMAIL: "email",
  PHONE: "phone",
};

export const VERIFICATION_CONFIG = {
  [VERIFICATION_TYPE.EMAIL]: {
    header: "Enter your email",
    subHeader:
      "Enter the email associated with your account. We’ll send a verification code.",
    inputLabel: "Email address",
    inputPlaceholder: "example@domain.com",
    toggleButtonLabel: "Use phone instead",
    validationErrorMessage: "Please enter a valid email address",
    emptyInputError: "Email address is required",
    validate: validateEmailFormat,
  },
  [VERIFICATION_TYPE.PHONE]: {
    header: "Enter your phone number",
    subHeader:
      "We’ll send a verification code via SMS. Message & data rates may apply.",
    inputLabel: "Phone number",
    inputPlaceholder: "+1 (555) 123-4567",
    toggleButtonLabel: "Use email instead",
    validationErrorMessage: "Please enter a valid phone number",
    emptyInputError: "Phone number is required",
    validate: validatePhoneNumberFormat,
  },
};
