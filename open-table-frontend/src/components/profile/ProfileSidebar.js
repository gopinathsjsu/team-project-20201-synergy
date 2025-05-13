import { List, ListItemButton, ListItemText, ListItemIcon, Divider, Box, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { useRouter } from "next/router";

export default function ProfileSidebar({ selected, onSelect }) {
  const router = useRouter();
  
  const menuItems = [
    { label: "Account Details", icon: <AccountCircleIcon />, id: 0 },
    { label: "My Reservations", icon: <BookmarksIcon />, id: 1 },
  ];
  
  return (
    <Box sx={{ py: 2 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          px: 3, 
          mb: 2, 
          fontWeight: "bold",
          color: "primary.main" 
        }}
      >
        User Profile
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <List component="nav" sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.id}
            selected={selected === item.id}
            onClick={() => onSelect(item.id)}
            sx={{
              borderRadius: 1,
              mb: 1,
              '&.Mui-selected': {
                backgroundColor: 'rgba(0, 127, 255, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 127, 255, 0.12)',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: selected === item.id ? 'primary.main' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              primaryTypographyProps={{ 
                fontWeight: selected === item.id ? 'medium' : 'regular',
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
