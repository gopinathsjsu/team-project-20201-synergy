import { Box, Container, useMediaQuery, useTheme, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export default function ProfileLayout({ sidebar, header, children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      {/* Mobile drawer toggle */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ position: "fixed", top: 10, left: 10, zIndex: 1200, bgcolor: "white", boxShadow: 2 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar - responsive drawer on mobile */}
      <Box component="nav" sx={{ width: { md: 240 }, flexShrink: 0 }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": { 
                boxSizing: "border-box", 
                width: 240,
                boxShadow: 3,
                bgcolor: "white"
              },
            }}
          >
            {sidebar}
          </Drawer>
        ) : (
          <Box 
            sx={{ 
              width: 240, 
              flexShrink: 0, 
              height: "100vh",
              position: "fixed",
              borderRight: 1, 
              borderColor: "divider",
              boxShadow: "4px 0 10px rgba(0,0,0,0.05)",
              bgcolor: "white",
              overflowY: "auto"
            }}
          >
            {sidebar}
          </Box>
        )}
      </Box>

      {/* Main content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 4 },
          ml: { md: "240px" }, // Offset for fixed sidebar on desktop
        }}
      >
        <Container maxWidth="lg">
          {header}
          <Box sx={{ mt: 4 }}>{children}</Box>
        </Container>
      </Box>
    </Box>
  );
}