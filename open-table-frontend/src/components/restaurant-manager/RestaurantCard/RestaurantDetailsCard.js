import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Chip
} from "@mui/material";
import { Visibility as VisibilityIcon, Edit as EditIcon } from "@mui/icons-material";

export default function RestaurantDetailsCard({ restaurant, imageUrl, onEdit, onView}) {
  return (
    <Card key={restaurant.id} sx={{ height: "100%" }}>
      <CardContent>
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt={restaurant.name}
            sx={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              borderRadius: 1,
              mb: 1,
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              borderRadius: 1,
              mb: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Typography variant="h6" gutterBottom>
          {restaurant.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {restaurant.cuisineType} • {restaurant.address}
        </Typography>
        {/* Status badge */}
        <Chip
          label={restaurant.approved ? "Approved" : "Pending"}
          color={restaurant.approved ? "success" : "warning"}
          size="small"
          sx={{ mt: 1 }}
        />
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(restaurant.id)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => onView(restaurant.id)}
          >
            View
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
