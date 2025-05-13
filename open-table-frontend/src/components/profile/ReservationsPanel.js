import ReservationsManager from "./ReservationsManager";
import { Box, Paper, Typography, Divider } from "@mui/material";

export default function ReservationsPanel() {
  return (
    <Box>
      <Paper
        elevation={2}
        sx={{
          p: 3, 
          borderRadius: 2
        }}
      >
        <Typography variant="h6" gutterBottom color="primary">
          My Reservations
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <ReservationsManager />
      </Paper>
    </Box>
  );
}
