import { useCallback, useState } from "react";
import Dialog from "@mui/material/Dialog";
import LoginForm from "./components/loginForm";
import VerifyForm from "./components/verifyForm";

function AuthModal({ isOpen, onClose }) {
  const [currentView, setCurrentView] = useState("login");
  const [loginData, setLoginData] = useState({});

  const onCurrentChangeView = (loginData) => {
    setLoginData(loginData);
    setCurrentView("verify");
  };

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
        <LoginForm
          onClose={onClose}
          onChangeCurrentView={onCurrentChangeView}
        />
      ) : (
        <VerifyForm onClose={onClose} loginData={loginData} />
      )}
    </Dialog>
  );
}

export default AuthModal;
