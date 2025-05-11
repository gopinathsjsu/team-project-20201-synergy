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

const RESTAURANT_MANAGER_HOME = {
  id: "home",
  label: "Home",
  iconComponent: <HomeIcon />,
  path: "/restaurant-manager/dashboard",
};

const ADMIN_HOME = {
  id: "home",
  label: "Home",
  iconComponent: <HomeIcon />,
  path: "/admin",
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

// Base nav items only include Home now
const BASE_NAV_ITEMS = [HOME];
// Customer nav items include Home and Profile
export const CUSTOMER_NAV_ITEMS = [HOME, PROFILE];
// Restaurant manager and admin only get their specific Home and no Profile
export const RESTAURANT_MANAGER_NAV_ITEMS = [RESTAURANT_MANAGER_HOME];
export const ADMIN_NAV_ITEMS = [ADMIN_HOME];

// Default items for logged in users (will be overridden by role-specific items)
export const LOGGED_IN_NAV_ITEMS = [...BASE_NAV_ITEMS, LOGOUT];
export const LOGGED_OUT_NAV_ITEMS = [LOGIN];

// Routes that require authentication
export const PROTECTED_ROUTES = [
  '/profile',
  '/restaurant-manager/dashboard',
  '/restaurant-manager/add-restaurant',
  '/restaurant-manager/edit-restaurant',
  '/restaurant-manager/view-restaurant',
  '/admin',
  '/admin/pending',
  '/admin/restaurants',
  '/booking'
];

// Restaurant manager specific routes
export const RESTAURANT_MANAGER_ROUTES = [
  '/restaurant-manager/dashboard',
  '/restaurant-manager/add-restaurant',
  '/restaurant-manager/edit-restaurant',
  '/restaurant-manager/view-restaurant'
];

// Admin specific routes
export const ADMIN_ROUTES = [
  '/admin',
  '/admin/pending',
  '/admin/restaurants'
];

// Routes accessible by customers
export const CUSTOMER_ROUTES = [
  '/',
  '/booking',
  '/restaurant',
  '/profile'
];
