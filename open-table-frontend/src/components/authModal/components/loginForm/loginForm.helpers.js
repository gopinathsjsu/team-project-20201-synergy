import axios from "axios";

export const validatePhoneNumberFormat = (phoneNumber) => {
  const regex = /^(\+1|1)?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/; // Basic international format, e.g., +1234567890
  return regex.test(phoneNumber);
};

export const validateEmailFormat = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const testApi = () => {
  return new Promise((response, reject) => {
    setTimeout(() => {
      response("API response");
    }, 500);
  });
};

export const handleOTPSend = async (
  setIsLoading,
  { verificationType, verificationInput, onChangeCurrentView }
) => {
  const req = {
    identifier: verificationType,
    value: verificationInput,
  };

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/otp/send`;

  try {
    const response = await axios.post(url, req, { withCredentials: true });
    const resData = response?.data?.data;
    console.log("OTP sent successfully...");
    setIsLoading(false);
    onChangeCurrentView({ ...req, ...resData });
  } catch (error) {
    console.log(error);
  }
};
