import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

export const LOGIN = {
  id: "login",
  label: "Login",
  iconComponent: <LoginIcon />,
};

const HOME = {
  id: "home",
  label: "Home",
  iconComponent: <HomeIcon />,
  path: "/",
};

const BOOKING = {
  id: "booking",
  label: "Booking",
  iconComponent: <BookIcon />,
  path: "/booking",
};

const PROFILE = {
  id: "profile",
  label: "Profile",
  iconComponent: <AccountCircleIcon />,
  path: "/profile",
};

export const LOGOUT = {
  id: "logout",
  label: "Logout",
  iconComponent: <LogoutIcon />,
};

const BASE_NAV_ITEMS = [HOME, BOOKING, PROFILE];

export const LOGGED_IN_NAV_ITEMS = [...BASE_NAV_ITEMS, LOGOUT];
export const LOGGED_OUT_NAV_ITEMS = [LOGIN];
