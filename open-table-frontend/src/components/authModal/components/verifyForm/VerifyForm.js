import { useContext, useState } from "react";
import _trim from "lodash/trim";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import styles from "./verifyForm.module.scss";
import { AuthContext } from "@/AuthContext/AuthContext";
import { useRouter } from "next/router";

function VerifyForm({ onClose, loginData, onShowRegistration }) {
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isVerifyLoading, setVerifyLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setError("");
    const inputValue = e.target?.value;
    if (_trim(inputValue)) {
      setVerificationCode(inputValue);
    }
  };

  const handleSubmit = async (e) => {
    const req = { ...loginData, otp: verificationCode };
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/otp/verify`;
    
    console.log("VerifyForm: Submitting OTP verification with data:", req);
    setVerifyLoading(true);
    
    try {
      console.log("VerifyForm: About to make POST request to:", url);
      const response = await axios.post(url, req, { withCredentials: true });
      console.log("VerifyForm: Full API response:", response);
      console.log("VerifyForm: Response structure:", JSON.stringify(response.data, null, 2));
      
      // Extract the response data correctly
      const responseData = response?.data?.data;
      console.log("VerifyForm: OTP verification response data:", responseData);
      console.log("VerifyForm: requiresRegistration value:", responseData?.requiresRegistration);
      
      // Do a more explicit check for requiresRegistration being true
      // This ensures we catch the case even if it's a string 'true' instead of boolean true
      const requiresRegistration = 
        responseData?.requiresRegistration === true || 
        responseData?.requiresRegistration === 'true';
      
      // Handle registration if required
      if (requiresRegistration) {
        console.log("VerifyForm: Registration required (explicit check passed), preparing registration data");
        
        // Pass the login data to the registration form
        const registrationData = {
          email: loginData.identifier === 'email' ? loginData.value : null,
          phoneNumber: loginData.identifier === 'phone' ? loginData.value : null,
          ...responseData
        };
        
        console.log("VerifyForm: Registration data prepared:", registrationData);
        console.log("VerifyForm: onShowRegistration exists:", typeof onShowRegistration === 'function');
        
        setSnackbarMessage("Please complete registration");
        setOpenSnackbar(true);
        
        // If onShowRegistration function is provided, use it to show registration modal
        if (typeof onShowRegistration === 'function') {
          console.log("VerifyForm: Calling onShowRegistration function with data:", registrationData);
          // Call the function to show registration but DO NOT close this form
          onShowRegistration(registrationData);
          console.log("VerifyForm: onShowRegistration function called. NOT closing verify form.");
          
          // IMPORTANT: Don't close the verify form, let AuthModal handle the view changes
          // This prevents the modal from closing completely
          // onClose(); - Removing this line
          
          // Return early to prevent the rest of the function from executing
          return;
        } else {
          console.error("VerifyForm: Registration function not provided");
          // Continue with login if for some reason registration function is not available
        }
      }
      
      // If we get here, registration is NOT required, so we can proceed with login
      console.log("Login successful, redirecting based on role");
      
      // Get user role from response
      const userRole = responseData.userRole || 'CUSTOMER'; // Default to CUSTOMER if no role
      console.log("VerifyForm: User role from response:", userRole);
      
      // Set user role in context
      setUserRole(userRole);
      
      // Set logged in state
      setIsLoggedIn(true);
      
      // Login successful snackbar
      setSnackbarMessage("Logged in successfully");
      setOpenSnackbar(true);
      
      // Close the modal
      onClose();
      
      // Redirect based on role - using router.replace instead of push to ensure proper redirection
      console.log(`VerifyForm: Redirecting user with role ${userRole}`);
      
      // Force immediate redirection without delay
      if (userRole === "ADMIN") {
        console.log("VerifyForm: Redirecting to admin page");
        // Use push to match AuthContext behavior
        router.push("/admin");
      } else if (userRole === "RESTAURANT_MANAGER") {
        console.log("VerifyForm: Redirecting to restaurant manager dashboard");
        router.push("/restaurant-manager/dashboard");
      } else {
        console.log("VerifyForm: Redirecting to home page");
        router.push("/");
      }
      
    } catch (err) {
      console.error("Verification error:", err);
      // Incorrect OTP, Retry snackbar
      setSnackbarMessage(err.response?.data?.errorMessage || err.message || "Verification failed");
      setError("Verification failed, please try again");
      setVerifyLoading(false);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    const { identifier, value } = loginData;
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/otp/send`;
    const req = {
      identifier,
      value,
    };
    setVerifyLoading(true);
    try {
      const response = await axios.post(url, req);
      console.log("OTP sent successfully...");
      setSnackbarMessage("OTP sent!!");
    } catch (error) {
      console.log(error);
    }
    setOpenSnackbar(true);
    setVerifyLoading(false);
  };

  const onCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <DialogTitle fontWeight={800} className="flex-between">
        {`Verify it's you`}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={styles.dialogContentContainer}>
        <DialogContentText>{`We have sent a code, enter the code to continue.`}</DialogContentText>
        <TextField
          error={!!error}
          variant="outlined"
          value={verificationCode}
          placeholder={"Enter verification code"}
          fullWidth
          helperText={error} // 'Incorrect OTP'
          onChange={handleChange}
        />
        <div className="flex flex-column g-8">
          <Button
            variant="contained"
            color="success"
            className={styles.verifyCta}
            onClick={handleSubmit}
            size="large"
            disabled={isVerifyLoading}
          >
            <Typography textTransform="none" fontWeight={800} variant="button">
              {isVerifyLoading ? "Verifying..." : "Verify"}
            </Typography>
          </Button>
          <div className="flex-center">
            <Typography variant="caption">{`Didn't receive a code?`}</Typography>
            <Button size="small" onClick={handleResendCode}>
              <Typography
                sx={{ textDecoration: "underline" }}
                textTransform="none"
                color="info"
                variant="button"
              >
                {`Resend Code`}
              </Typography>
            </Button>
          </div>
        </div>
      </DialogContent>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        onClose={onCloseSnackbar}
        autoHideDuration={2000}
        message={snackbarMessage}
      />
    </>
  );
}

export default VerifyForm;
