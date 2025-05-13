import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';

const ConflictingBookingModal = ({ 
  open, 
  onClose, 
  onKeep, 
  onContinue, 
  conflictingBooking,
  newBookingDetails 
}) => {
  if (!conflictingBooking || !newBookingDetails) {
    console.warn("Missing booking details in ConflictingBookingModal");
    return null;
  }

  console.log("Conflict Modal - Existing booking:", conflictingBooking);
  console.log("Conflict Modal - New booking:", newBookingDetails);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown date";
    return dayjs(dateStr).format('dddd, MMMM D');
  };
  
  const formatTime = (timeStr) => {
    if (!timeStr) return "Unknown time";
    return timeStr.includes('T') 
      ? dayjs(timeStr).format('h:mm A')
      : dayjs(`2000-01-01T${timeStr}`).format('h:mm A');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: '100%',
          maxWidth: 700
        }
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            You already have a reservation around this time
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="body1" mb={3} color="text.secondary">
          Looks like you have a reservation at {conflictingBooking.restaurantName} within one hour of {formatTime(newBookingDetails.time)}.
          Do you want to keep this reservation or book a new reservation instead?
        </Typography>
        
        <Grid container spacing={3}>
          {/* Existing reservation */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                border: '1px solid', 
                borderColor: 'divider',
                borderRadius: 2,
                p: 3,
                height: '100%'
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {conflictingBooking.restaurantName || "Unknown Restaurant"}
              </Typography>
              
              <Box mt={2}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <CalendarMonthIcon fontSize="small" color="action" />
                  <Typography>{formatDate(conflictingBooking.bookingDate)}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography>{formatTime(conflictingBooking.bookingTime)}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1}>
                  <PeopleIcon fontSize="small" color="action" />
                  <Typography>
                    {conflictingBooking.partySize} {conflictingBooking.partySize === 1 ? 'person' : 'people'}
                  </Typography>
                </Box>
              </Box>
              
              <Box mt={3} display="flex" justifyContent="center">
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={onKeep}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Keep
                </Button>
              </Box>
            </Box>
          </Grid>
          
          {/* New reservation */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                border: '1px solid', 
                borderColor: 'divider',
                borderRadius: 2,
                p: 3,
                height: '100%'
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {newBookingDetails.restaurantName || "New Restaurant"}
              </Typography>
              
              <Box mt={2}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <CalendarMonthIcon fontSize="small" color="action" />
                  <Typography>{formatDate(newBookingDetails.date)}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography>{formatTime(newBookingDetails.time)}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1}>
                  <PeopleIcon fontSize="small" color="action" />
                  <Typography>
                    {newBookingDetails.partySize} {newBookingDetails.partySize === 1 ? 'person' : 'people'}
                  </Typography>
                </Box>
              </Box>
              
              <Box mt={3} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={onContinue}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ConflictingBookingModal; 