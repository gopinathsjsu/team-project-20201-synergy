import { useContext, useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import { AuthContext } from "@/AuthContext/AuthContext";
import { useRouter } from "next/router";
import styles from "./registrationForm.module.scss";

function RegistrationForm({ onClose, userData }) {
  console.log("RegistrationForm: Received userData:", userData);
  
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
  // Form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: userData?.email || "",
    phoneNumber: userData?.phoneNumber || "",
    // Default role is CUSTOMER
    role: "CUSTOMER" 
  });

  // Form validation
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: ""
  });
  
  useEffect(() => {
    console.log("RegistrationForm: userData in effect:", userData);
    console.log("RegistrationForm: Current form data:", formData);
    
    if (!userData || Object.keys(userData).length === 0) {
      console.warn("RegistrationForm: No userData provided - this might cause issues with registration");
    }
  }, [userData, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number formatting
    if (name === 'phoneNumber') {
      // Remove all non-digits
      const digitsOnly = value.replace(/\D/g, '');
      
      // Format the phone number as needed
      let formattedPhone = value;
      
      // If it's a US number starting with 1, format it properly
      if (digitsOnly.length > 0) {
        if (digitsOnly.startsWith('1')) {
          // Format as +1 (XXX) XXX-XXXX
          formattedPhone = formatUSPhoneNumber(digitsOnly);
        } else {
          // Add +1 if user enters digits without country code
          if (!value.startsWith('+') && digitsOnly.length > 0) {
            formattedPhone = '+' + digitsOnly;
          }
        }
      }
      
      setFormData({
        ...formData,
        [name]: formattedPhone
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
  };
  
  // Format US phone number as +1 (XXX) XXX-XXXX
  const formatUSPhoneNumber = (digits) => {
    if (digits.length <= 1) return `+${digits}`;
    if (digits.length <= 4) return `+${digits.substring(0, 1)} ${digits.substring(1)}`;
    if (digits.length <= 7) return `+${digits.substring(0, 1)} (${digits.substring(1, 4)}) ${digits.substring(4)}`;
    if (digits.length <= 11) return `+${digits.substring(0, 1)} (${digits.substring(1, 4)}) ${digits.substring(4, 7)}-${digits.substring(7)}`;
    return `+${digits.substring(0, 1)} (${digits.substring(1, 4)}) ${digits.substring(4, 7)}-${digits.substring(7, 11)}`;
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      valid = false;
    }
    
    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      valid = false;
    }
    
    // Validate email
    if (!userData?.phoneNumber && !formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (formData.email && !validateEmailFormat(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }
    
    // Validate phone number
    if (!userData?.email && !formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      valid = false;
    } else if (formData.phoneNumber && !validatePhoneNumberFormat(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
      valid = false;
    }
    
    setFormErrors(newErrors);
    return valid;
  };
  
  // Simple validation functions
  const validateEmailFormat = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const validatePhoneNumberFormat = (phoneNumber) => {
    const regex = /^(\+1|1)?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return regex.test(phoneNumber);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Clean up phone number for submission - extract digits only
      const cleanedPhoneNumber = formData.phoneNumber.replace(/\D/g, '');
      const phoneWithPrefix = cleanedPhoneNumber.startsWith('1') 
        ? '+' + cleanedPhoneNumber 
        : '+1' + cleanedPhoneNumber;
      
      // Ensure role is set to CUSTOMER (this is redundant but makes it explicit)
      const requestPayload = {
        ...formData,
        phoneNumber: phoneWithPrefix,
        role: "CUSTOMER"
      };
      
      console.log("Submitting registration data:", requestPayload);
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`;
      
      // Log the exact request being made
      console.log("Registration request:", {
        url,
        method: 'POST',
        data: requestPayload,
        withCredentials: true
      });
      
      const response = await axios.post(url, requestPayload, { 
        withCredentials: true 
      });
      
      console.log("Registration successful:", response.data);
      
      // Set user role (should always be CUSTOMER for new registrations)
      console.log("Setting user role to CUSTOMER in AuthContext");
      setUserRole("CUSTOMER");
      
      // Set logged in state
      console.log("Setting isLoggedIn to true in AuthContext");
      setIsLoggedIn(true);
      
      // Show success message
      setSnackbarMessage("Registration successful!");
      setOpenSnackbar(true);
      
      // IMPORTANT: Only close the modal AFTER showing success message and updating state
      // Use a longer timeout to ensure state updates have time to propagate
      setTimeout(() => {
        console.log("Registration complete, now closing modal after delay");
        onClose();
        
        // Redirect to homepage after another short delay
        setTimeout(() => {
          console.log("Now redirecting to homepage");
          router.push("/");
        }, 500);
      }, 2000); // Give this a longer delay (2 seconds)
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Error details:", err.response?.data || err.message);
      setError(err.response?.data?.errorMessage || err.message || "Registration failed");
      setSnackbarMessage("Registration failed. Please try again.");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <DialogTitle fontWeight={800} className="flex-between">
        Complete Registration
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={styles.dialogContentContainer}>
        <DialogContentText>
          Please provide the following information to complete your registration.
        </DialogContentText>
        
        <Box component="form" className={styles.formContainer}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                variant="outlined"
                value={formData.firstName}
                onChange={handleChange}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                required
                className={styles.inputField}
                placeholder="Enter your first name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                variant="outlined"
                value={formData.lastName}
                onChange={handleChange}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                required
                className={styles.inputField}
                placeholder="Enter your last name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                disabled={!!userData?.email}
                required={!userData?.phoneNumber}
                className={styles.inputField}
                placeholder="example@domain.com"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phoneNumber"
                label="Phone Number"
                fullWidth
                variant="outlined"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!formErrors.phoneNumber}
                helperText={formErrors.phoneNumber}
                disabled={!!userData?.phoneNumber}
                required={!userData?.email}
                className={styles.inputField}
                placeholder="+1 (555) 123-4567"
              />
            </Grid>
          </Grid>
          
          {error && (
            <Typography className={styles.errorText}>
              {error}
            </Typography>
          )}
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleSubmit}
            disabled={isLoading}
            className={styles.registerCta}
          >
            <Typography textTransform="none" fontWeight={800} variant="button">
              {isLoading ? "Registering..." : "Complete Registration"}
            </Typography>
          </Button>
        </Box>
      </DialogContent>
      
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        onClose={onCloseSnackbar}
        autoHideDuration={3000}
        message={snackbarMessage}
      />
    </>
  );
}

export default RegistrationForm; 