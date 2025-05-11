import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import useRouteNavigate from "@/hooks/routeNavigate";
import { useRouter } from "next/router";

export const AuthContext = createContext();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function AuthProvider({ children }) {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { handleRouteChange } = useRouteNavigate();
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  // Custom setters with logging
  const updateIsLoggedIn = (value) => {
    console.log("AuthContext: Setting isLoggedIn to:", value);
    
    // Only update if the value actually changes
    if (isLoggedIn !== value) {
      console.log(`AuthContext: Login state changing from ${isLoggedIn} to ${value}`);
      setIsLoggedIn(value);
    } else {
      console.log("AuthContext: Login state unchanged, still:", value);
    }
  };

  const updateUserRole = (role) => {
    console.log("AuthContext: Setting userRole to:", role);
    
    // Only update if the role actually changes
    if (userRole !== role) {
      console.log(`AuthContext: User role changing from ${userRole} to ${role}`);
      setUserRole(role);
    } else {
      console.log("AuthContext: User role unchanged, still:", role);
    }
  };

  useEffect(() => {
    console.log("AuthContext: Checking auth status with router path:", router.pathname);
    
    (async function checkAuth() {
      try {
        console.log("AuthContext: Making API call to check auth status...");
        const res = await axios.get(`${BASE_URL}/api/auth/status`, {
          withCredentials: true,
        });
        console.log("AuthContext: Full auth status response:", res.data);
        
        const { loggedIn, userRole: roleFromApi } = res?.data?.data;
        console.log("AuthContext: Auth status parsed:", { loggedIn, roleFromApi });
        
        // When the auth state changes, log a clear message about it
        if (isLoggedIn !== loggedIn) {
          console.log(`AuthContext: Updating login state from ${isLoggedIn} to ${loggedIn}`);
        }
        updateIsLoggedIn(loggedIn);
        
        if (loggedIn && roleFromApi) {
          if (userRole !== roleFromApi) {
            console.log(`AuthContext: Updating user role from ${userRole} to ${roleFromApi}`);
          }
          updateUserRole(roleFromApi);
          
          // ONLY redirect if we're EXACTLY on the homepage (/)
          if (router.pathname === '/') {
            console.log(`AuthContext: User at homepage, checking if redirection needed for ${roleFromApi}`);
            
            if (roleFromApi === 'RESTAURANT_MANAGER') {
              console.log("AuthContext: Redirecting manager to dashboard");
              router.push('/restaurant-manager/dashboard');
            } else if (roleFromApi === 'ADMIN') {
              console.log("AuthContext: Redirecting admin to admin page");
              router.push('/admin');
            }
          } else {
            console.log(`AuthContext: User not at homepage (${router.pathname}), no redirection needed`);
          }
        } else if (loggedIn && !roleFromApi) {
          console.warn("AuthContext: User is logged in but has no role assigned");
        }
      } catch (err) {
        console.error("AuthContext: Error checking auth status:", err);
        console.error("AuthContext: Error details:", err.response?.data || err.message);
      }
    })();
  }, [router.pathname, router]);

  const handleLogout = useCallback(async () => {
    try {
      console.log("Logging out...");
      await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      updateIsLoggedIn(false);
      updateUserRole(null);
      handleRouteChange("/");
    } catch (err) {
      console.log("Error while logging out:", err);
    }
  }, [handleRouteChange]);

  const handleHomeClick = useCallback(() => {
    console.log("Home click with role:", userRole);
    if (userRole === 'RESTAURANT_MANAGER') {
      console.log("AuthContext: handleHomeClick - Redirecting manager to dashboard");
      router.push('/restaurant-manager/dashboard');
    } else if (userRole === 'ADMIN') {
      console.log("AuthContext: handleHomeClick - Redirecting admin to admin page");
      router.push('/admin');
    } else {
      console.log("AuthContext: handleHomeClick - Redirecting customer to homepage");
      router.push('/');
    }
  }, [userRole, router]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        openLoginModal,
        setOpenLoginModal,
        setIsLoggedIn: updateIsLoggedIn,
        handleLogout,
        userRole,
        setUserRole: updateUserRole,
        handleHomeClick
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};

AuthProvider.defaultProps = {
  children: null,
};

export default AuthProvider;
