import { createContext, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async function checkAuth() {
      try {
        const res = await axios.get("https://example.com/api", {
          withCredentials: true,
        });
        const authData = res?.data;
        setIsLoggedIn(authData);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={isLoggedIn}>{children}</AuthContext.Provider>
  );
}

AuthContext.propTypes = {
  children: PropTypes.node,
};

AuthContext.defaultProps = {
  children: null,
};

export default AuthProvider;
