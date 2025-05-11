import { useCallback, useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import LoginForm from "./components/loginForm";
import VerifyForm from "./components/verifyForm";
import RegistrationForm from "./components/registrationForm";

function AuthModal({ isOpen, onClose }) {
  console.log("AuthModal rendering with isOpen:", isOpen);
  
  const [currentView, setCurrentView] = useState("login");
  const [loginData, setLoginData] = useState({});
  const [userData, setUserData] = useState({});
  const [isViewChanging, setIsViewChanging] = useState(false);
  
  // Prevent modal from closing while changing views
  const handleClose = () => {
    if (isViewChanging) {
      console.log("AuthModal: Ignoring close request during view transition");
      return;
    }
    console.log("AuthModal: Closing modal");
    onClose();
  };

  const onCurrentChangeView = (loginData) => {
    console.log("AuthModal: Changing view from login to verify with data:", loginData);
    setIsViewChanging(true);
    setLoginData(loginData);
    setCurrentView("verify");
    setTimeout(() => setIsViewChanging(false), 500);
  };

  const handleShowRegistration = (userData) => {
    console.log("AuthModal: Showing registration form with userData:", userData);
    if (!userData) {
      console.error("AuthModal: No userData provided to handleShowRegistration");
      return; // Don't proceed if userData is empty
    }
    
    // Set view changing flag to prevent closing
    setIsViewChanging(true);
    
    // Set user data first
    setUserData(userData);
    
    // Then change view in the next tick to ensure state is updated
    console.log("AuthModal: Setting currentView to registration");
    setCurrentView("registration");
    console.log("AuthModal: View should now be registration");
    
    // Reset the view changing flag after a delay
    setTimeout(() => {
      setIsViewChanging(false);
      console.log("AuthModal: View transition complete");
    }, 500);
  };

  // Track state changes
  useEffect(() => {
    console.log("AuthModal: currentView changed to:", currentView);
    console.log("AuthModal: userData:", userData);
  }, [currentView, userData]);
  
  // Track modal open/close
  useEffect(() => {
    console.log("AuthModal: isOpen changed to:", isOpen);
  }, [isOpen]);

  // Determine which component to render
  const renderCurrentView = () => {
    console.log("AuthModal: Rendering view:", currentView);
    
    if (currentView === "login") {
      return (
        <LoginForm
          onClose={handleClose}
          onChangeCurrentView={onCurrentChangeView}
        />
      );
    } else if (currentView === "verify") {
      return (
        <VerifyForm 
          onClose={handleClose} 
          loginData={loginData} 
          onShowRegistration={handleShowRegistration}
        />
      );
    } else if (currentView === "registration") {
      console.log("AuthModal: About to render RegistrationForm with userData:", userData);
      return (
        <RegistrationForm 
          onClose={handleClose} 
          userData={userData}
        />
      );
    }
    
    // Shouldn't reach here
    console.error("AuthModal: Invalid view state:", currentView);
    return null;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose} // Use our custom handler
      sx={{
        "& .MuiDialog-paper": {
          minHeight: "600px",
        },
      }}
      fullWidth
      maxWidth="xs"
      slotProps={{
        backdrop: {
          // Only reset to login when actually exiting (not during view changes)
          onExited: () => {
            console.log("AuthModal: Dialog exited, resetting to login view");
            setCurrentView("login");
            setUserData({});
          },
        },
      }}
    >
      {renderCurrentView()}
    </Dialog>
  );
}

export default AuthModal;
