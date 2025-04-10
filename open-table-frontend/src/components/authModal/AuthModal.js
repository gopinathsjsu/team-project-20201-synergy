import { useCallback, useState } from "react";
import Dialog from "@mui/material/Dialog";
import LoginForm from "./components/loginForm";
import VerifyForm from "./components/verifyForm";

function AuthModal({ isOpen, onClose }) {
  const [currentView, setCurrentView] = useState("login");

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          minHeight: "600px",
        },
      }}
      fullWidth
      maxWidth="xs"
      slotProps={{
        backdrop: {
          onExited: () => setCurrentView("login"),
        },
      }}
    >
      {currentView === "login" ? (
        <LoginForm onClose={onClose} onChangeCurrentView={setCurrentView} />
      ) : (
        <VerifyForm onClose={onClose} />
      )}
    </Dialog>
  );
}

export default AuthModal;
