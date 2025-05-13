import { useMemo, useState } from "react";

// Lodash
import _trim from "lodash/trim";

// MUI
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Constants
import { VERIFICATION_TYPE, VERIFICATION_CONFIG } from "./loginForm.constants";

// Helpers
import { handleOTPSend } from "./loginForm.helpers";

// Styles
import styles from "./loginForm.module.scss";

function LoginForm({ onClose, onChangeCurrentView }) {
  const [verificationType, setVerificationType] = useState(
    VERIFICATION_TYPE.PHONE
  );
  const [verificationInput, setVerificationInput] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isContinueDisabled, setIsContinueDisabled] = useState(false);
  const [isCtaLoading, setIsCtaLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const currentVerificationConfig = useMemo(
    () => VERIFICATION_CONFIG[verificationType],
    [verificationType]
  );

  const handleChange = (e) => {
    const value = e?.target?.value;
    setVerificationInput(value);
    setValidationError("");
    if (_trim(value)) {
      setIsContinueDisabled(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!verificationInput.trim()) {
      setValidationError(currentVerificationConfig.emptyInputError);
      setIsContinueDisabled(true);
    } else if (!currentVerificationConfig.validate(verificationInput)) {
      console.log(verificationInput);
      setValidationError(currentVerificationConfig.validationErrorMessage);
      setIsContinueDisabled(true);
    } else {
      setValidationError("");
      console.log("Submitted phone number:", verificationInput);
      // Proceed with form submission logic
      setIsCtaLoading(true);
      handleOTPSend(setIsCtaLoading, {
        verificationType,
        verificationInput,
        onChangeCurrentView,
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: `OTP sent to your ${
              verificationType === VERIFICATION_TYPE.PHONE ? "phone" : "email"
            }`,
            severity: "success",
          });
        },
        onError: (errorMsg) => {
          setSnackbar({
            open: true,
            message: errorMsg || "Failed to send OTP. Please try again.",
            severity: "error",
          });
        },
      });
    }
  };

  const handleVerificationTypeToggle = (e) => {
    setValidationError("");
    setIsContinueDisabled(false);
    setVerificationInput("");
    const updatedVerificationType =
      verificationType === VERIFICATION_TYPE.PHONE
        ? VERIFICATION_TYPE.EMAIL
        : VERIFICATION_TYPE.PHONE;
    setVerificationType(updatedVerificationType);
  };

  return (
    <>
      <DialogTitle
        fontWeight={800}
        textTransform="capitalize"
        className="flex-between"
      >
        {currentVerificationConfig.header}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={styles.dialogContentContainer}>
        <DialogContentText>
          {currentVerificationConfig.subHeader}
        </DialogContentText>
        <TextField
          error={!!validationError}
          variant="outlined"
          value={verificationInput}
          label={currentVerificationConfig.inputLabel}
          placeholder={currentVerificationConfig.inputPlaceholder}
          fullWidth
          helperText={validationError}
          onChange={handleChange}
        />
        <div className="flex flex-column g-8">
          <Button
            disabled={isContinueDisabled}
            sx={{
              cursor: isContinueDisabled ? "not-allowed" : "pointer",
            }}
            variant="contained"
            className={styles.continueCta}
            onClick={handleSubmit}
            size="large"
            loading={isCtaLoading}
          >
            <Typography
              textTransform="none"
              fontSize={15}
              fontWeight={800}
              variant="button"
            >
              Continue
            </Typography>
          </Button>
          <Button size="small" onClick={handleVerificationTypeToggle}>
            <Typography color="success" variant="caption">
              {currentVerificationConfig.toggleButtonLabel}
            </Typography>
          </Button>
        </div>
      </DialogContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default LoginForm;
