import { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Box
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export default function RestaurantManagerDashboard() {
  const router = useRouter();
  // Temporary mock data - we'll replace this with real API data later
  const [restaurants, setRestaurants] = useState([
    { id: 1, name: 'Sample Restaurant 1', cuisineType: 'Italian', addressLine: '123 Main St' },
    { id: 2, name: 'Sample Restaurant 2', cuisineType: 'Mexican', addressLine: '456 Oak Ave' },
  ]);

  const handleAddRestaurant = () => {
    router.push('/restaurant-manager/add-restaurant');
  };

  const handleEditRestaurant = (id) => {
    router.push(`/restaurant-manager/edit-restaurant/${id}`);
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
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {restaurant.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {restaurant.cuisineType}
                </Typography>
                <Typography variant="body2">
                  {restaurant.addressLine}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEditRestaurant(restaurant.id)}
                  >
                    Edit Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
