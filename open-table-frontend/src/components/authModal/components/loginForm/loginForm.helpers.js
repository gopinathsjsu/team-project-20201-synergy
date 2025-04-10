import axios from "axios";

export const validatePhoneNumberFormat = (phoneNumber) => {
  const regex = /^(\+1|1)?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/; // Basic international format, e.g., +1234567890
  return regex.test(phoneNumber);
};

export const validateEmailFormat = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const handleOTPSend = async ({
  verificationType,
  verificationInput,
  onChangeCurrentView,
}) => {
  const req = {
    identifier: verificationType,
    value: verificationInput,
  };

  try {
    // await axios.post(url, data);
    // console.log("OTP sent successfully...");
    onChangeCurrentView("verify");
  } catch (error) {}
};
