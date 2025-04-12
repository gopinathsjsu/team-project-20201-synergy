import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import styles from "./verifyForm.module.scss";

function VerifyForm({ onClose }) {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const inputValue = e.target?.value;
    if (_trim(inputValue)) {
      setVerificationCode(inputValue);
    }
  };

  const handleSubmit = async (e) => {
    try {
      // await axios.post(url, req);
    } catch (err) {
      console.log(err);
    }
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
    </>
  );
}

export default VerifyForm;
