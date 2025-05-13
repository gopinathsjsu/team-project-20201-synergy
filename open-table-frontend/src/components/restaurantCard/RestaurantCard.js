import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
  Rating,
  Badge,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/AuthContext/AuthContext";
import { getPresignedUrls } from "@/utils/imageUtils";

// Fallback image to use only when the actual image fails to load
const PLACEHOLDER_IMAGE = "/restaurant-image.svg";

export default function RestaurantCard({
  restaurant,
  searchPayload,
  presignedUrls = {},
}) {
  const {
    name,
    address,
    cuisineType,
    costRating,
    distance,
    availableTimeSlots,
    mainPhotoUrl,
    id,
    avgRating,
    bookingCount,
  } = restaurant;

  // Initialize with placeholder but try to load the actual image
  const [imageUrl, setImageUrl] = useState(PLACEHOLDER_IMAGE);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { isLoggedIn, setOpenLoginModal } = useContext(AuthContext);

  const { date, time, partySize } = searchPayload;

  // Use presigned URLs passed from parent or fetch individually if needed
  useEffect(() => {
    // Skip if there's no photo URL or we've already handled an error
    if (!mainPhotoUrl || imageError) {
      return;
    }

    const loadImage = async () => {
      try {
        // First check if URL is already in the presignedUrls prop
        if (presignedUrls && presignedUrls[mainPhotoUrl]) {
          const url = presignedUrls[mainPhotoUrl];
          if (url) {
            setImageUrl(url);
            return;
          }
        }

        // Only fetch individually if we're not already loading and not in parent props
        if (isLoading) return;

        setIsLoading(true);
        console.log(
          `RestaurantCard (${name}) - Fetching image URL individually for:`,
          mainPhotoUrl
        );
        const urls = await getPresignedUrls([mainPhotoUrl]);

        if (urls && urls[mainPhotoUrl]) {
          setImageUrl(urls[mainPhotoUrl]);
          setImageError(false);
        } else {
          console.warn(
            `RestaurantCard (${name}) - No URL found for image:`,
            mainPhotoUrl
          );
          setImageUrl(PLACEHOLDER_IMAGE);
        }
      } catch (error) {
        console.error(`RestaurantCard (${name}) - Error loading image:`, error);
        setImageUrl(PLACEHOLDER_IMAGE);
        setImageError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [mainPhotoUrl, presignedUrls, name, imageError, isLoading]);

  const onSlotClick = (timeSlot) => {
    if (!isLoggedIn) {
      setOpenLoginModal(true);
      return;
    }
    router.push({
      pathname: "/booking",
      query: {
        date,
        time: timeSlot,
        partySize,
        restaurantName: name,
        restaurantId: id,
      },
    });
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        borderRadius: 3,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <Box position="relative">
        <CardMedia
          component="img"
          height="180"
          image={imageUrl}
          alt={name}
          sx={{ objectFit: "cover" }}
          onError={(e) => {
            if (!imageError) {
              console.error(
                `RestaurantCard (${name}) - Failed to load image from URL:`,
                imageUrl
              );
              setImageUrl("/images/placeholder.png");
              setImageError(true);
            }
          }}
        />
        {bookingCount > 0 && (
          <Chip
            icon={<PeopleAltIcon fontSize="small" />}
            label={`${bookingCount} ${
              bookingCount === 1 ? "booking" : "bookings"
            } today`}
            size="small"
            color="secondary"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              fontWeight: "bold",
              boxShadow: 2,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ px: 2.5, py: 2 }}>
        {/* Name */}
        <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
          {name}
        </Typography>

        {/* Address */}
        <Stack direction="row" alignItems="center" spacing={0.5} mb={1.5}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary" noWrap>
            {address}
          </Typography>
        </Stack>

        {/* Cuisine • Price • Distance */}
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <Typography variant="body2" color="text.secondary">
            {cuisineType}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {"$".repeat(costRating)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {distance.toFixed(2)} mi
          </Typography>
        </Stack>

        {/* Rating and Review Count */}
        {typeof avgRating === 'number' && (
          <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
            <Rating
              name="restaurant-rating"
              value={avgRating}
              precision={0.5}
              readOnly
              size="small"
            />
            {typeof reviewCount === 'number' && reviewCount > 0 && (
              <Typography variant="body2" color="text.secondary">
                ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
              </Typography>
            )}
          </Stack>
        )}

        {/* Available Slots */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {availableTimeSlots?.map((slot) => (
            <Chip
              key={slot}
              label={slot}
              size="small"
              clickable
              sx={{
                px: 1,
                bgcolor: "primary.light",
                color: "primary.white",
                fontWeight: 500,
              }}
              onClick={() => onSlotClick(slot)}
            />
          ))}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2.5, pb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            py: 1.25,
            background: (theme) =>
              `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            "&:hover": {
              background: (theme) =>
                `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
            },
          }}
          href={`/restaurant/${id}?restaurantName=${name}&bookingDate=${
            date || dayjs()
          }&bookingTime=${time || "20:00"}&partySize=${partySize || 2}`}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
}
