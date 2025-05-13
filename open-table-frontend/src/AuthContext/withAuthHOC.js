// utils/withAuth.js
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/AuthContext/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();
    const [isAuthChecking, setIsAuthChecking] = useState(true);

    useEffect(() => {
      // Set a timeout to prevent immediate redirects on page refresh
      // This gives time for the auth check to complete
      const authCheckTimer = setTimeout(() => {
        if (!isLoggedIn) {
          router.replace("/");
        }
        setIsAuthChecking(false);
      }, 1000); // Give the auth context 1 second to initialize

      return () => clearTimeout(authCheckTimer);
    }, [isLoggedIn, router]);

    // Show loading while checking auth status
    if (isAuthChecking) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Checking authentication...
          </Typography>
        </Box>
      );
    }

    // Only render the protected component if logged in
    if (!isLoggedIn) return null;

    return <Component {...props} />;
  };
}
