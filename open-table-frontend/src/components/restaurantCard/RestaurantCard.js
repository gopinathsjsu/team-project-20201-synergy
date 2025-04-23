import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
} from "@mui/material";

function RestaurantCard({ restaurant }) {
  const {
    name,
    cuisine_type,
    cost_rating,
    description,
    address_line,
    city,
    state,
    hours,
    place_id,
  } = restaurant;

  const today = new Date().getDay();
  const todayHours = hours.find((h) => h.day_of_week === today);

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Optional image section */}
      <CardMedia
        component="div"
        sx={{ height: 160, backgroundColor: "#e0e0e0" }}
        image="/placeholder.jpg" // replace later with restaurant.image_url
        title={name}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {cuisine_type} · {"₹".repeat(cost_rating)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {address_line}, {city}, {state}
        </Typography>
        <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
          Open today: {todayHours?.open_time?.slice(0, 5)} -{" "}
          {todayHours?.close_time?.slice(0, 5)}
        </Typography>
      </CardContent>

      <CardContent>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          href={`/restaurant/${place_id}`}
        >
          View & Book
        </Button>
      </CardContent>
    </Card>
  );
}

export default RestaurantCard;
