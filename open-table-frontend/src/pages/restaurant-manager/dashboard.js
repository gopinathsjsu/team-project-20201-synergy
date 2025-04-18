import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Container, Typography, Button, Grid, Box, Snackbar, Alert, CircularProgress } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import {
  fetchRestaurants,
  getBatchPresignedUrls,
} from "../api/restaurant-manager-api";

import RestaurantDetailsCard from "../../components/restaurant-manager/RestaurantCard/RestaurantDetailsCard";

export default function RestaurantManagerDashboard() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  // Map from S3 key to presigned URL for GET access.
  const [presignedUrls, setPresignedUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Fetch restaurant list on mount.
  useEffect(() => {
    async function loadRestaurants() {
      try {
        const data = await fetchRestaurants();
        setRestaurants(data.restaurantSearchDetails);
      } catch (e) {
        setError(e.message);
        setSnackbar({ open: true, message: e.message, severity: "error" });
      }
      setLoading(false);
    }
    loadRestaurants();
  }, []);

  

  // Fetch presigned URLs in batch when the restaurant list is loaded.
  useEffect(() => {
    async function loadPresignedUrls() {
      // Extract unique keys from restaurants' mainPhotoUrl field.
      const keys = restaurants
        .filter((r) => r.mainPhotoUrl)
        .map((r) => r.mainPhotoUrl);
      if (keys.length === 0) return;
      try {
        const urls = await getBatchPresignedUrls(keys);
        setPresignedUrls(urls);
      } catch (e) {
        console.error("Error fetching presigned URLs:", e);
        setSnackbar({ open: true, message: e.message, severity: "error" });
      }
    }
    if (restaurants.length > 0) {
      loadPresignedUrls();
    }
  }, [restaurants]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  // Handlers for navigation actions
  const handleAddRestaurant = () => {
    router.push("/restaurant-manager/add-restaurant");
  };

  const handleEditRestaurant = (id) => {
    router.push(`/restaurant-manager/edit-restaurant/${id}`);
  };

  const handleViewRestaurant = (id) => {
    router.push(`/restaurant-manager/view-restaurant/${id}`);
  };

  return (
    <Container maxWidth="lg">

      {/* Header Section */}
      <Box sx={{ my: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" component="h1">
              My Restaurants
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddRestaurant}
            >
              Add Restaurant
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Restaurants List */}
      <Grid container spacing={3}>
        {restaurants.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
            <RestaurantDetailsCard
              restaurant={restaurant}
              imageUrl={
                restaurant.mainPhotoUrl
                  ? presignedUrls[restaurant.mainPhotoUrl]
                  : null
              }
              onEdit={handleEditRestaurant}
              onView={handleViewRestaurant}
            />
          </Grid>
        ))}
      </Grid>

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
    </Container>
  );
}
