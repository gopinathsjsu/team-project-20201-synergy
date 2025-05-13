import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

// Getting backend base URL from environment variables from .env.local
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';

function AdminDashboard() {
  // State to hold the analytics data
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect hook to fetch data after component mounts
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`${BASE_URL}/api/admin/analytics/reservations`, {
          withCredentials: true, // Important to send cookies for authentication
        }
      );

        // Check if the response structure is as expected (BTResponse)
        if (response.data && response.data.status === 'success') {
          setAnalyticsData(response.data.data);
        } else {
           // Handle potential backend error structure
           throw new Error(response.data?.errorMessage || 'Failed to fetch analytics data');
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
         // Try to get error message from backend response, fallback to default
         const message = err.response?.data?.errorMessage || err.message || 'Could not fetch analytics data.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []); // Empty dependency array means this runs once on mount

  // --- Render Loading State ---
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
        <Typography sx={{ marginLeft: 2 }}>Loading Analytics...</Typography>
      </Box>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <Box padding={3}>
        <Alert severity="error">Error fetching analytics: {error}</Alert>
      </Box>
    );
  }

  // --- Render No Data State ---
  if (!analyticsData) {
     return (
       <Box padding={3}>
         <Alert severity="warning">No analytics data available.</Alert>
       </Box>
     );
  }

  // --- Render Dashboard Content ---
  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
       <Typography variant="caption" display="block" gutterBottom>
        {/* This date range is determined by the backend, currently for the this month */}
        (Booking Reservations from {new Date(analyticsData.startDate).toLocaleDateString()} to {new Date(analyticsData.endDate).toLocaleDateString()})
      </Typography>

      <Grid container spacing={3} sx={{ marginTop: 2 }}>
        {/* Total Reservations Card */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              {/* Added "Total Reservations" text */}
              <Typography variant="h6" gutterBottom>
                Total Reservations
              </Typography>
              {/* Displays the number of total reservations */}
              <Typography variant="h4">{analyticsData.totalReservations ?? 'N/A'}</Typography>
              {/* Indicates the time period for the data */}
              <Typography variant="body2">(Current Month)</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Reservations per Day Card */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Reservations / Day</Typography>
               <Typography variant="h4">
                 {/* Formats the average reservations to two decimal places */}
                 {analyticsData.averageReservationsPerDay?.toFixed(2) ?? 'N/A'}
              </Typography>
               {/* Indicates the time period for the data */}
               <Typography variant="body2">(Current Month)</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Most Popular Restaurants List */}
        <Grid item xs={12}>
           <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Most Popular Restaurants (Current Month)
              </Typography>
              {/* Checks if there are popular restaurants to display */}
              {analyticsData.mostPopularRestaurants && analyticsData.mostPopularRestaurants.length > 0 ? (
                <List dense>
                  {/* Maps through the list of popular restaurants and displays them */}
                  {analyticsData.mostPopularRestaurants.map((restaurant, index) => (
                    <React.Fragment key={restaurant.id}>
                      <ListItem>
                        <ListItemText
                          primary={`${index + 1}. ${restaurant.name}`}
                          secondary={`${restaurant.addressLine}, ${restaurant.city}, ${restaurant.state}`}
                        />
                        {/* You could add more details or links here */}
                      </ListItem>
                      {/* Adds a divider between list items */}
                      {index < analyticsData.mostPopularRestaurants.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography>No popular restaurants data available for the period.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for feedback messages (e.g., error fetching data) */}
      {/* This part is already present in your original code */}
      {/* You can keep this as is for displaying messages */}
      {/*
       <Snackbar
         open={snackbar.open}
         autoHideDuration={6000}
         onClose={() => setSnackbar({ ...snackbar, open: false })}
         anchorOrigin={{ vertical: "top", horizontal: "center" }}
       >
         <Alert
           onClose={() => setSnackbar({ ...snackbar, open: false })}
           severity={snackbar.severity}
           sx={{ width: "100%" }}
         >
           {snackbar.message}
         </Alert>
       </Snackbar>
       */}
    </Box>
  );
}

export default AdminDashboard;