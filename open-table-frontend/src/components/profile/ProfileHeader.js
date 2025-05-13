import { Box, Avatar, Typography, Paper } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export default function ProfileHeader({ firstName, lastName }) {
  const initials = `${firstName?.[0] || ""}${
    lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <Box sx={{ mb: 4 }}>
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 3 }
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar
            src="/profile-placeholder.jpg"
            sx={{ 
              width: 120, 
              height: 120, 
              fontSize: 42,
              bgcolor: "#4267B2",
            }}
          >
            {initials}
          </Avatar>
          <Box 
            sx={{ 
              position: "absolute", 
              bottom: 0, 
              right: 0,
              backgroundColor: "white",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: 1,
              cursor: "pointer"
            }}
          >
            <CameraAltIcon sx={{ color: "#666", fontSize: 20 }} />
          </Box>
        </Box>
        
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Hi, {firstName} {lastName}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            BookTable Member
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
