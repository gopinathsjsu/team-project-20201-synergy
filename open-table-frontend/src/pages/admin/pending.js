import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

// Get the backend base URL from environment variables
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';

function PendingRestaurants() {
  // State for the list, loading status, errors, and snackbar feedback
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Function to fetch pending restaurants - using useCallback for potential future use
  //Here we are using useCallback because we are passing the function as a dependency to useEffect.
  //So if we dont use useCallback, the function will be recreated on every render and it will cause an infinite loop.
  const fetchPendingRestaurants = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/restaurants/pending`, {
        withCredentials: true, // Send cookies
      });
      if (response.data && response.data.status === 'success') {
        // Ensure data is always an array, even if null/undefined from backend
        setRestaurants(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        throw new Error(response.data?.errorMessage || 'Failed to fetch pending restaurants');
      }
    } catch (err) {
      console.error("Error fetching pending restaurants:", err);
      const message = err.response?.data?.errorMessage || err.message || 'Could not fetch data.';
      setError(message);
      setRestaurants([]); // Clear restaurants on error
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array for useCallback as it doesn't depend on props/state

  // Fetch data when the component mounts
  useEffect(() => {
    fetchPendingRestaurants();
  }, [fetchPendingRestaurants]); // Include the function itself in the dependency array

  // --- Action Handlers (Functionality TBD) ---
  const handleApprove = async (restaurantId) => {
    console.log(`Approve clicked for ID: ${restaurantId}`);
     setSnackbar({ open: true, message: `Approving restaurant ${restaurantId}...`, severity: 'info' });
     try {
        const response = await axios.post(`${BASE_URL}/api/admin/restaurants/${restaurantId}/approve`, {}, {
            withCredentials: true,
        });
        if (response.data && response.data.status === 'success') {
            setSnackbar({ open: true, message: 'Restaurant approved successfully!', severity: 'success' });
            fetchPendingRestaurants(); // Re-fetch the list to update UI
        } else {
            throw new Error(response.data?.errorMessage || 'Approval failed');
        }
     } catch (err) {
        console.error("Error approving restaurant:", err);
        const message = err.response?.data?.errorMessage || err.message || 'Could not approve restaurant.';
        setSnackbar({ open: true, message: `Error: ${message}`, severity: 'error' });
     }
  };

  const handleRemove = async (restaurantId) => {
    console.log(`Remove clicked for ID: ${restaurantId}`);
     setSnackbar({ open: true, message: `Removing restaurant ${restaurantId}...`, severity: 'info' });
     // Confirm before deleting? Optional but recommended
     // if (!window.confirm(`Are you sure you want to remove restaurant ${restaurantId}? This cannot be undone from the UI.`)) {
     //    setSnackbar({ open: false, message: '', severity: 'info' }); // Close processing snackbar
     //    return;
     // }
     try {
         const response = await axios.delete(`${BASE_URL}/api/admin/restaurants/${restaurantId}`, {
             withCredentials: true,
         });
         if (response.data && response.data.status === 'success') {
             setSnackbar({ open: true, message: 'Restaurant removed successfully!', severity: 'success' });
             fetchPendingRestaurants(); // Re-fetch the list to update UI
         } else {
             throw new Error(response.data?.errorMessage || 'Removal failed');
         }
      } catch (err) {
         console.error("Error removing restaurant:", err);
         const message = err.response?.data?.errorMessage || err.message || 'Could not remove restaurant.';
         setSnackbar({ open: true, message: `Error: ${message}`, severity: 'error' });
      }
  };

  // --- Snackbar Handler ---
   const handleCloseSnackbar = (event, reason) => {
     if (reason === 'clickaway') {
       return;
     }
     setSnackbar({ ...snackbar, open: false });
   };


  // --- Render Logic ---
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
        <Typography sx={{ marginLeft: 2 }}>Loading Pending Restaurants...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding={3}>
        <Alert severity="error">Error fetching data: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Pending Restaurant Approvals
      </Typography>
      {restaurants.length === 0 ? (
        <Typography>No restaurants are currently pending approval.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="pending restaurants table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Cuisine</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurants.map((restaurant) => (
                <TableRow
                  key={restaurant.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {restaurant.id}
                  </TableCell>
                  <TableCell>{restaurant.name}</TableCell>
                  <TableCell>{restaurant.cuisineType}</TableCell>
                  <TableCell>{`${restaurant.addressLine}, ${restaurant.city}, ${restaurant.state}`}</TableCell>
                  <TableCell>{restaurant.contactPhone}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ marginRight: 1 }}
                      onClick={() => handleApprove(restaurant.id)} // Pass ID to handler
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleRemove(restaurant.id)} // Pass ID to handler
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
       {/* Snackbar for feedback messages */}
       <Snackbar
         open={snackbar.open}
         autoHideDuration={6000} // Hide after 6 seconds
         onClose={handleCloseSnackbar}
         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
       >
         {/* Use Alert inside Snackbar for severity colors */}
         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
           {snackbar.message}
         </Alert>
       </Snackbar>
    </Box>
  );
}

export default PendingRestaurants;