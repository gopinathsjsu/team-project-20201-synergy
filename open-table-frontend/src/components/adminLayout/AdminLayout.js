import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Material UI components
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ListAltIcon from '@mui/icons-material/ListAlt';

// Styles
import styles from './adminLayout.module.scss';

// Define the navigation items
const adminNavItems = [
  { text: 'Dashboard', href: '/admin', icon: <DashboardIcon /> },
  { text: 'Pending Approvals', href: '/admin/pending', icon: <PendingActionsIcon /> },
  { text: 'All Restaurants', href: '/admin/restaurants', icon: <ListAltIcon /> },
];

const drawerWidth = 240;

function AdminLayout({ children }) {
  const router = useRouter();

  const drawerContent = (
    <div>
      { <Toolbar /> } 
      <Divider />
      <List>
        {adminNavItems.map((item) => (
          <Link href={item.href} passHref key={item.text} legacyBehavior>
            <ListItem disablePadding>
              <ListItemButton selected={router.pathname === item.href}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        className={styles.drawer}
        variant="permanent"
        sx={{
          // Keep MUI sx props for things not easily done with CSS modules or for overrides
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              position: 'relative' 
            },
        }}
        anchor="left"
      >
        {drawerContent}
      </Drawer>

      {/* Main content area */}
      <Box
        component="main"
         // Add the className prop here too if needed (e.g., for specific content box styles)
         // If no specific styles needed beyond MUI sx, you can omit className here.
         // className={styles.contentBox} // Assuming contentBox provides additional styles
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        {<Toolbar />}
        {children}
      </Box>
    </Box>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node,
};

export default AdminLayout;