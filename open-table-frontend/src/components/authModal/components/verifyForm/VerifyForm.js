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

function VerifyForm({ onClose, loginData }) {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isVerifyLoading, setVerifyLoading] = useState(false);

  const handleChange = (e) => {
    const inputValue = e.target?.value;
    if (_trim(inputValue)) {
      setVerificationCode(inputValue);
    }
  };

  const handleSubmit = async (e) => {
    const req = { ...loginData, otp: verificationCode };
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/otp/verify`;
    try {
      await axios.post(url, req);
      // loggedIn successful snackbar
      setSnackbarMessage("Logged In successfully");
      setVerifyLoading(false);
      onClose();
      setIsLoggedIn(true);
    } catch (err) {
      console.log(err);
      // Incorrect OTP, Retry snackbar
      setSnackbarMessage(err.message);
      setError("Verification failed, Retry!");
    } finally {
      setOpenSnackbar(true);
    }
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
            // disabled={isContinueDisabled}
            // sx={{
            //   cursor: isContinueDisabled ? "not-allowed" : "pointer",
            // }}
            variant="contained"
            color="success"
            className={styles.verifyCta}
            onClick={handleSubmit}
            size="large"
            loading={isVerifyLoading}
          >
            <Typography textTransform="none" fontWeight={800} variant="button">
              {`Verify`}
            </Typography>
          </Button>
          <div className="flex-center">
            <Typography variant="caption">{`Didn't receive a code?`}</Typography>
            <Button size="small" onClick={handleSubmit}>
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
