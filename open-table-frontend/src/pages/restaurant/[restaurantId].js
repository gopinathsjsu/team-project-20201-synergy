import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Chip,
  Button,
  TextField,
  MenuItem,
  Grid,
  ImageList,
  ImageListItem,
  CardMedia,
  Rating,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import dayjs from "dayjs";
import CircularProgress from "@mui/material/CircularProgress";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MapWithPin from "@/components/mapComponent/MapView";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TimeSelect from "@/components/timePicker/TimePicker";
import Image from "next/image";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import axios from "axios";
import { AuthContext } from "@/AuthContext/AuthContext";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getPresignedUrls } from "@/utils/imageUtils";

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Default placeholder image
const DEFAULT_PLACEHOLDER =
  "https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg";

export default function RestaurantPage(props) {
  const [restaurant, setRestaurantData] = useState({});
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [additionalImageUrls, setAdditionalImageUrls] = useState([]);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [galleryImageErrors, setGalleryImageErrors] = useState({});

  const { isLoggedIn, setOpenLoginModal } = useContext(AuthContext);

  const router = useRouter();
  const { query } = router;
  const { restaurantId, bookingDate, bookingTime, partySize } = query;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs(bookingDate));
  const [selectedTime, setSelectedTime] = useState("");
  const [totalPerson, setTotalPerson] = useState(2);

  // State for new review
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchRestaurantDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/home/restaurants/${restaurantId}`
      );
      const restaurantData = response?.data?.data;
      setRestaurantData(restaurantData);

      // Load all restaurant images (main + additional)
      loadRestaurantImages(restaurantData);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load all restaurant images using presigned URLs
  const loadRestaurantImages = async (restaurantData) => {
    try {
      if (!restaurantData) return;

      setIsImageLoading(true);
      setImageError(false);
      setGalleryImageErrors({});

      // Collect all image keys that need presigned URLs
      const { mainPhotoUrl, additionalPhotoUrls = [] } = restaurantData;

      // Log data for debugging
      console.log("Raw mainPhotoUrl:", mainPhotoUrl);
      console.log("Raw additionalPhotoUrls:", additionalPhotoUrls);

      // Ensure additionalPhotoUrls is an array
      const safeAdditionalPhotos = Array.isArray(additionalPhotoUrls)
        ? additionalPhotoUrls
        : [];

      const allImageKeys = [mainPhotoUrl, ...safeAdditionalPhotos].filter(
        Boolean
      );

      if (allImageKeys.length === 0) {
        setIsImageLoading(false);
        return;
      }

      console.log("RestaurantPage - Loading images for keys:", allImageKeys);

      // If it's already a full URL, use it directly for main image
      if (
        mainPhotoUrl &&
        typeof mainPhotoUrl === "string" &&
        mainPhotoUrl.startsWith("http")
      ) {
        setMainImageUrl(mainPhotoUrl);
      }

      // If there are keys to fetch, get their presigned URLs
      if (allImageKeys.length > 0) {
        try {
          // Just get all the presigned URLs without validation at this stage
          const urls = await getPresignedUrls(allImageKeys);
          console.log("RestaurantPage - Received presigned URLs:", urls);

          // Handle main image
          if (mainPhotoUrl && !mainPhotoUrl.startsWith("http")) {
            // Try different key formats to find a match
            if (urls[mainPhotoUrl]) {
              setMainImageUrl(urls[mainPhotoUrl]);
            } else if (urls["/" + mainPhotoUrl]) {
              setMainImageUrl(urls["/" + mainPhotoUrl]);
            } else if (
              mainPhotoUrl.startsWith("/") &&
              urls[mainPhotoUrl.substring(1)]
            ) {
              setMainImageUrl(urls[mainPhotoUrl.substring(1)]);
            }
          }

          // Process additional photos
          if (safeAdditionalPhotos.length > 0) {
            const processedUrls = safeAdditionalPhotos
              .map((key) => {
                if (!key) return null;

                // If it's a full URL already, use it directly
                if (typeof key === "string" && key.startsWith("http")) {
                  return key;
                }

                // Try all possible key formats
                if (urls[key]) {
                  return urls[key];
                } else if (urls["/" + key]) {
                  return urls["/" + key];
                } else if (key.startsWith("/") && urls[key.substring(1)]) {
                  return urls[key.substring(1)];
                }

                console.log(`No URL found for key: ${key}`);
                return null;
              })
              .filter(Boolean);

            console.log(
              "RestaurantPage - Processed additional URLs:",
              processedUrls
            );
            setAdditionalImageUrls(processedUrls);
          }
        } catch (fetchError) {
          console.error(
            "RestaurantPage - Error fetching presigned URLs:",
            fetchError
          );
        }
      }
    } catch (error) {
      console.error("RestaurantPage - Error in loadRestaurantImages:", error);
    } finally {
      setIsImageLoading(false);
    }
  };

  // Handle errors for individual gallery images
  const handleGalleryImageError = (index, url) => {
    console.error(
      `RestaurantPage - Failed to load gallery image at index ${index} from URL:`,
      url
    );
    setGalleryImageErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  useEffect(() => {
    setSelectedDate(dayjs(bookingDate));
    setSelectedTime(bookingTime);
    setTotalPerson(partySize);
    if (restaurantId) {
      fetchRestaurantDetails();
    }
  }, [bookingDate, bookingTime, partySize, restaurantId]);

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const disablePastDates = (date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  const handleTotalPerson = (e) => {
    const value = e.target?.value;
    setTotalPerson(value);
  };

  const handleBookNow = () => {
    if (!isLoggedIn) {
      setOpenLoginModal(true);
      return;
    }
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    router.push(
      {
        pathname: `/booking`,
        query: {
          restaurantId,
          restaurantName: restaurant?.name,
          date: formattedDate,
          time: selectedTime,
          partySize: totalPerson,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  // Add the BookingCount component at the top of your render method
  const renderBookingCount = () => {
    if (!restaurant || !restaurant.bookingCount) return null;

    return (
      <Box display="flex" justifyContent="flex-start" mb={3}>
        <Chip
          icon={<PeopleAltIcon />}
          label={`${restaurant.bookingCount} ${
            restaurant.bookingCount === 1 ? "booking" : "bookings"
          } today`}
          color="secondary"
          size="medium"
          sx={{
            fontWeight: "bold",
            boxShadow: 2,
            fontSize: "1rem",
            py: 1,
            px: 2,
            "& .MuiChip-icon": {
              fontSize: "1.2rem",
              color: "inherit",
            },
          }}
        />
      </Box>
    );
  };

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", margin: 20 }}>
        <CircularProgress />
      </Box>
    );

  const {
    name,
    mainPhotoUrl,
    additionalPhotoUrls = [],
    cuisineType,
    costRating,
    description,
    contactPhone,
    addressLine,
    city,
    state,
    zipCode,
    country,
    longitude,
    latitude,
    operatingHours,
    timeSlots,
    averageRating,
    reviewCount,
    reviews,
  } = restaurant;

  // Default placeholder image if no image or error loading
  const displayImageUrl = mainImageUrl || DEFAULT_PLACEHOLDER;

  return (
    <Box marginX={20} marginBottom={10}>
      <Box
        component="main"
        px={{ xs: 2, md: 4 }}
        py={{ xs: 3, md: 5 }}
        sx={{ bgcolor: "grey.100", minHeight: "100vh" }}
      >
        {/* Hero Image */}
        <Paper
          elevation={3}
          sx={{ borderRadius: 2, overflow: "hidden", mb: 4 }}
        >
          {isImageLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={300}
              bgcolor="grey.200"
            >
              <CircularProgress />
            </Box>
          ) : (
            <CardMedia
              component="img"
              height="300"
              image={displayImageUrl}
              alt={name}
              sx={{ objectFit: "cover" }}
              onError={(e) => {
                if (!imageError) {
                  console.error(
                    `RestaurantPage - Failed to load main image from URL:`,
                    displayImageUrl
                  );
                  setMainImageUrl(DEFAULT_PLACEHOLDER);
                  setImageError(true);
                }
              }}
            />
          )}
        </Paper>

        {/* Additional Photos Gallery (if available) */}
        {additionalImageUrls.length > 0 && (
          <Box mb={4}>
            <ImageList cols={3} gap={16} sx={{ overflow: "hidden" }}>
              {additionalImageUrls.map((url, index) => (
                <ImageListItem key={index} sx={{ height: 200 }}>
                  {galleryImageErrors[index] ? (
                    <CardMedia
                      component="img"
                      src={DEFAULT_PLACEHOLDER}
                      alt={`${name || "Restaurant"} image ${
                        index + 1
                      } (placeholder)`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      src={url}
                      alt={`${name || "Restaurant"} image ${index + 1}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                      onError={() => handleGalleryImageError(index, url)}
                    />
                  )}
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        )}

        <Box marginTop={4} display="flex" gap={4}>
          <Paper elevation={3} sx={{ p: 2, width: "60%" }}>
            <Box display="flex" gap={3} paddingY={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Choose Booking Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  shouldDisableDate={disablePastDates}
                  sx={{ width: 250 }}
                />
              </LocalizationProvider>

              <TimeSelect
                label="Booking Time"
                value={selectedTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                daySlots={
                  selectedDate && timeSlots
                    ? timeSlots.find(
                        (slot) => slot.dayOfWeek === selectedDate.day()
                      )?.times || []
                    : []
                }
              />

              <TextField
                sx={{ width: 250 }}
                select
                label="Choose total person"
                value={totalPerson}
                onChange={handleTotalPerson}
              >
                {Array(20)
                  .fill(0)
                  .map(
                    (_, index) =>
                      index !== 0 && (
                        <MenuItem key={index} value={index + 1}>
                          {`${index + 1} People`}
                        </MenuItem>
                      )
                  )}
              </TextField>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              onClick={handleBookNow}
              sx={{
                borderRadius: "32px", // pill shape
                px: 4, // horizontal padding
                py: 1.5, // vertical padding
                textTransform: "none", // preserve casing
                fontWeight: 600, // make it pop
                boxShadow: (theme) => theme.shadows[4],
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: (theme) => theme.shadows[8],
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
            >
              {isLoggedIn ? `Book Now` : `Sign In to Book now`}
            </Button>
          </Paper>
          {latitude && longitude && (
            <MapWithPin lat={latitude} lng={longitude} />
          )}
        </Box>

        {/* Basic Info */}
        <Paper
          elevation={2}
          sx={{ borderRadius: 2, p: { xs: 2, md: 3 }, marginTop: 5 }}
        >
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {name}
          </Typography>

          {/* Average Rating and Review Count */}
          {typeof averageRating === 'number' && (
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Rating
                name="restaurant-average-rating"
                value={averageRating}
                precision={0.5}
                readOnly
              />
              {typeof reviewCount === 'number' && reviewCount > 0 && (
                <Typography variant="body1" color="text.secondary">
                  ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                </Typography>
              )}
            </Stack>
          )}

          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <Chip label={cuisineType} color="primary" size="small" />
            <Chip
              label={"$".repeat(costRating)}
              variant="outlined"
              size="small"
            />
          </Stack>
          {renderBookingCount()}

          <Typography variant="body1" color="text.secondary" mb={2}>
            {description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Address & Contact */}
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            📍 {addressLine}, {city}, {state} {zipCode}, {country}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            📞 {contactPhone}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Operating Hours */}
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            ⏰ Operating Hours
          </Typography>
          <Stack spacing={1} mb={2}>
            {operatingHours?.map((oh) => (
              <Typography key={oh.dayOfWeek} variant="body2">
                <strong>{WEEK_DAYS[oh.dayOfWeek]}:</strong>{" "}
                {oh.openTime && oh.closeTime 
                  ? `${oh.openTime.slice(0, 5)} – ${oh.closeTime.slice(0, 5)}`
                  : "Closed"
                }
              </Typography>
            ))}
          </Stack>

          {/* Available Time Slots */}
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            🕒 Available Time Slots
          </Typography>
          {timeSlots?.map((daySlot) => (
            <Accordion key={daySlot.dayOfWeek} elevation={1}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={500}>
                  {WEEK_DAYS[daySlot.dayOfWeek]}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {daySlot.times && daySlot.times.length > 0 ? (
                    daySlot.times.map((t) => (
                      <Chip
                        key={t}
                        label={t.slice(0, 5)}
                        size="small"
                        sx={{
                          bgcolor: "primary.light",
                          color: "primary.dark",
                          fontWeight: 500,
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No available time slots
                    </Typography>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>

        {/* Reviews Section */}
        <Paper
          elevation={2}
          sx={{ borderRadius: 2, p: { xs: 2, md: 3 }, marginTop: 5 }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom mb={2}>
            Reviews
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* List of Reviews */}
          {reviews && reviews.length > 0 ? (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {reviews.map((review, index) => (
                <Box key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>{review.userName ? review.userName.charAt(0) : 'A'}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Rating name={`review-rating-${index}`} value={review.rating} readOnly size="small" />}
                      secondaryTypographyProps={{ component: 'div' }}
                      secondary={(
                        <>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {review.userName || 'Anonymous User'} - {dayjs(review.createdAt).format('MMMM D, YYYY')}
                          </Typography>
                          <Typography variant="body1" mt={1}>{review.reviewText}</Typography>
                        </>
                      )}
                    />
                  </ListItem>
                  {index < reviews.length - 1 && <Divider variant="inset" component="li" />}
                </Box>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No reviews yet. Be the first to review!
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
