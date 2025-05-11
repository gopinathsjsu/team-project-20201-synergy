import { useContext, useMemo, useState, useEffect } from "react";

/* Material UI */
import AppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

/* Miscellaneous */
import PropTypes from "prop-types";
import cx from "classnames";

/* Hooks */
import useRouteNavigate from "@/hooks/routeNavigate";
import { useRouter } from "next/router";

/* Constants */
import {
  LOGGED_OUT_NAV_ITEMS,
  CUSTOMER_NAV_ITEMS,
  RESTAURANT_MANAGER_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  LOGIN,
  LOGOUT,
  RESTAURANT_MANAGER_ROUTES,
  ADMIN_ROUTES,
  CUSTOMER_ROUTES,
  PROTECTED_ROUTES
} from "./appLayout.constants";

/* Styles */
import styles from "./appLayout.module.scss";
import AuthModal from "@/components/authModal";
import { AuthContext } from "@/AuthContext/AuthContext";

function AppLayout({ children }) {
  const { handleRouteChange } = useRouteNavigate();
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);

  const { 
    isLoggedIn, 
    handleLogout, 
    openLoginModal, 
    setOpenLoginModal,
    userRole,
    handleHomeClick 
  } = useContext(AuthContext);

  const handleLoginModalClose = () => {
    setOpenLoginModal(false);
  };

  const navItems = useMemo(() => {
    console.log("AppLayout: Recalculating navItems with:", { isLoggedIn, userRole });
    
    if (!isLoggedIn) {
      console.log("AppLayout: User not logged in, showing login nav items");
      return LOGGED_OUT_NAV_ITEMS;
    }
    
    console.log("AppLayout: User logged in with role:", userRole);
    
    // For restaurant managers
    if (userRole === 'RESTAURANT_MANAGER') {
      console.log("AppLayout: Showing restaurant manager nav items");
      // Restaurant managers already have correct Home path, just add Logout
      return [...RESTAURANT_MANAGER_NAV_ITEMS, LOGOUT];
    }
    
    // For admins
    if (userRole === 'ADMIN') {
      console.log("AppLayout: Showing admin nav items");
      // Admins already have correct Home path, just add Logout
      return [...ADMIN_NAV_ITEMS, LOGOUT];
    }
    
    // For customers, show Home, Profile and Logout
    console.log("AppLayout: Showing customer nav items");
    return [...CUSTOMER_NAV_ITEMS, LOGOUT];
  }, [isLoggedIn, userRole]);

  const handleNavClick = (navItemId, path) => {
    if (navItemId === LOGIN.id) {
      setOpenLoginModal(true);
    } else if (navItemId === LOGOUT.id) {
      handleLogout();
    } else if (navItemId === 'home') {
      handleHomeClick();
    } else {
      handleRouteChange(path);
    }
  };

  // Check if the current path is allowed for the user's role
  const isAllowedRoute = (path, role) => {
    if (!role) return true; // No role restrictions if not logged in
    
    switch (role) {
      case 'RESTAURANT_MANAGER':
        return RESTAURANT_MANAGER_ROUTES.some(route => 
          path === route || path.startsWith(`${route}/`));
      case 'ADMIN':
        return ADMIN_ROUTES.some(route => 
          path === route || path.startsWith(`${route}/`));
      case 'CUSTOMER':
        return CUSTOMER_ROUTES.some(route => 
          path === route || path.startsWith(`${route}/`));
      default:
        return true;
    }
  };

  // Check authentication and role-based access
  useEffect(() => {
    // Check if route is protected and user is not logged in
    const pathIsProtected = PROTECTED_ROUTES.some(route => 
      router.pathname === route || router.pathname.startsWith(`${route}/`));

    if (pathIsProtected && !isLoggedIn) {
      router.replace("/");
      return;
    }

    // Check if user has access to the current route based on role
    if (isLoggedIn && userRole && !isAllowedRoute(router.pathname, userRole)) {
      // Redirect to appropriate home page based on role
      switch (userRole) {
        case 'RESTAURANT_MANAGER':
          router.replace('/restaurant-manager/dashboard');
          break;
        case 'ADMIN':
          router.replace('/admin');
          break;
        case 'CUSTOMER':
          router.replace('/');
          break;
        default:
          router.replace('/');
      }
      return;
    }

    setCheckedAuth(true);
  }, [router.pathname, isLoggedIn, userRole, router]);

  if (!checkedAuth) return null;

  return (
    <>
      <AppBar position="static" color="primary">
        <Box className="flex-between">
          <Typography
            variant="h5"
            className={cx("flex-center", styles.appLogo)}
            onClick={() => handleHomeClick()}
            sx={{ cursor: 'pointer' }}
          >
            BOOK TABLE
          </Typography>
          <List className="flex">
            {navItems.map(({ id, label, iconComponent, path }) => (
              <ListItem key={id} disablePadding>
                <ListItemButton onClick={() => handleNavClick(id, path)}>
                  <ListItemIcon>{iconComponent}</ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </AppBar>
      <Divider />
      <Box component="main">{children}</Box>
      <AuthModal isOpen={openLoginModal} onClose={handleLoginModalClose} />
    </>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node,
};

AppLayout.defaultProps = {
  children: null,
};

export default AppLayout;
