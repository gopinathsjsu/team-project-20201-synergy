import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export const AuthContext = createContext();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async function checkAuth() {
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/status`, {
          withCredentials: true,
        });
        const authData = res?.data;
        setIsLoggedIn(authData);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []); // will run when App refreshes (App remounts again)

  const handleLogout = useCallback(async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
    } catch (err) {
      console.log("error while logging out", err);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, handleLogout }}>
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
