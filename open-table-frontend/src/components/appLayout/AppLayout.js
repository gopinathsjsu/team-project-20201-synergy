import { useContext, useMemo, useState } from "react";

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

/* Constants */
import {
  LOGGED_IN_NAV_ITEMS,
  LOGGED_OUT_NAV_ITEMS,
  LOGIN,
  LOGOUT,
} from "./appLayout.constants";

/* Styles */
import styles from "./appLayout.module.scss";
import AuthModal from "@/components/authModal";
import { AuthContext } from "@/AuthContext/AuthContext";

function AppLayout({ children }) {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const { handleRouteChange } = useRouteNavigate();

  const { isLoggedIn } = useContext(AuthContext);

  const handleLoginModalClose = () => {
    setOpenLoginModal(false);
  };

  const navItems = useMemo(
    () => (isLoggedIn ? LOGGED_IN_NAV_ITEMS : LOGGED_OUT_NAV_ITEMS),
    [isLoggedIn]
  );

  const handleNavClick = (navItemId, path) => {
    if (navItemId === LOGIN.id) {
      // handleLoginClick()
      setOpenLoginModal(true);
    } else if (navItemId === LOGOUT.id) {
      // handleLogoutClick()
    } else handleRouteChange(path);
  };

  const handleLoginClick = () => {
    // trigger login modal state
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Box className="flex-between">
          <Typography
            variant="h5"
            className={cx("flex-center", styles.appLogo)}
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
  isLoggedIn: PropTypes.bool,
  children: PropTypes.node,
};

AppLayout.defaultProps = {
  isLoggedIn: false,
  children: null,
};

export default AppLayout;
