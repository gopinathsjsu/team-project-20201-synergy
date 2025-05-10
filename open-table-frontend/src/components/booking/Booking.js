import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import _trim from "lodash/trim";
import _isEmpty from "lodash/isEmpty";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BookTwoToneIcon from "@mui/icons-material/BookTwoTone";
import AccessTimeTwoToneIcon from "@mui/icons-material/AccessTimeTwoTone";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WcTwoToneIcon from "@mui/icons-material/WcTwoTone";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TextField, Button } from "@mui/material";
import axios from "axios";

dayjs.extend(customParseFormat);

const isValidPhone = (phone) => {
  if (!phone) {
    return false;
  }
  const usPhoneRegex =
    /^(?:\+?1[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})(?:[-.\s]?x\d+)?$/;
  return usPhoneRegex.test(phone);
};

const isValidEmail = (email) => {
  if (!email) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Booking = () => {
  const [ctaText, setCtaText] = useState("phone");
  const [formattedDateTime, setFormattedDateTime] = useState(null);
  const [error, setError] = useState("");
  const [dinerDetail, setDinerDetail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { query } = router;
  // Destructure query parameters, adding type checks for robustness
  const restaurantId =
    typeof query.restaurantId === "string" ? query.restaurantId : null;
  const restaurantName =
    typeof query.restaurantName === "string"
      ? query.restaurantName
      : "Restaurant";
  const date = typeof query.date === "string" ? query.date : null;
  const time = typeof query.time === "string" ? query.time : null;
  const partySize =
    typeof query.partySize === "string" ? parseInt(query.partySize, 10) : 1;

  useEffect(() => {
    if (date && time && typeof date === "string" && typeof time === "string") {
      const dateTimeString = `${date}T${time}`;
      const bookingDateTime = dayjs(dateTimeString);

      if (bookingDateTime.isValid()) {
        const displayFormat = "MMMM D, YYYY at h:mm A";
        setFormattedDateTime(bookingDateTime.format(displayFormat));
        console.log(
          "Formatted Date/Time for UI:",
          bookingDateTime.format(displayFormat)
        );
      } else {
        console.error("Invalid date or time received from query parameters.");
        setFormattedDateTime("Invalid Date/Time");
      }
    } else {
      console.warn("Missing or invalid date/time query parameters.");
      setFormattedDateTime("Date/Time Not Available");
    }
  }, [router.query, date, time]);

  const handleDinerDetail = (e) => {
    const value = e.target?.value;
    setError("");
    setDinerDetail(_trim(value));
  };

  const handleConfirmBooking = async () => {
    if (_isEmpty(dinerDetail)) {
      setError(`Missing diner detail`);
      return;
    } else if (ctaText === "phone" && !isValidPhone(dinerDetail)) {
      setError(`Phone number is invalid`);
      return;
    } else if (ctaText === "email" && !isValidEmail(dinerDetail)) {
      setError("Email is invalid");
      return;
    }
    if (!restaurantId || !date || !time || partySize <= 0) {
      setError(
        "Missing essential booking details. Please go back and try again."
      );
      return;
    }
    setError("");
    setIsLoading(true);
    const bookingPayload = {
      restaurantId,
      bookingDate: date,
      bookingTime: time,
      partySize,
      notifierType: ctaText,
      notifierValue: dinerDetail,
    };
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/booking/create`;
      const response = axios.post(url, bookingPayload, {
        withCredentials: true,
      });
      console.log(response?.data?.data);
    } catch (err) {
      console.log(err.message);
      setError(`An unexpected error occurred: ${err.message}`);
    }
    setIsLoading(false);
  };

  return (
    <Paper
      elevation={8}
      sx={{
        p: 3,
        m: { xs: 2, md: 10 }, // Responsive margin
        borderRadius: 3,
        width: { xs: "95%", md: "60%" }, // Responsive width
        mx: "auto", // Center the paper horizontally
      }}
    >
      <Box display="flex" flexDirection="column" gap={1.5}>
        <Typography
          variant="subtitle1"
          color="success.dark"
          sx={{
            fontWeight: "medium",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <CheckCircleOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
          You&apos;re almost done!
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <BookTwoToneIcon fontSize="large" color="primary" />
          <Typography variant="h5" fontWeight="bold">
            {restaurantName || "Loading Restaurant Name..."}{" "}
            {/* Handle potential null */}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <AccessTimeTwoToneIcon fontSize="medium" color="action" />
          <Typography variant="body1">
            {formattedDateTime || "Loading Date/Time..."}
          </Typography>{" "}
          {/* Handle potential null */}
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <WcTwoToneIcon fontSize="medium" color="action" />
          <Typography variant="body1">
            {partySize > 0
              ? `${partySize} ${partySize === 1 ? "person" : "people"}`
              : "Party Size Not Specified"}{" "}
            {/* Handle potential invalid partySize */}
          </Typography>
        </Box>
      </Box>
      <Box marginTop={3}>
        <Typography variant="h6" fontWeight="bold">
          Diner details
        </Typography>
        <TextField
          fullWidth
          onChange={handleDinerDetail} // Use the corrected handler
          label={`Enter ${ctaText}`} // Label changes based on ctaText
          value={dinerDetail} // Bind value to state
          margin="normal"
          type={ctaText === "email" ? "email" : "tel"} // Use appropriate input type
          error={!!error} // Set error prop based on error state
          helperText={error} // Display error message below the field
        />
        <Button
          onClick={() => {
            setDinerDetail("");
            setError(null);
            setCtaText(ctaText === "email" ? "phone" : "email");
          }}
        >
          {ctaText === "phone" ? "Use email instead" : "Use phone instead"}
        </Button>
      </Box>
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        onClick={handleConfirmBooking}
        sx={{
          borderRadius: "32px",
          px: 4,
          py: 1.5,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: (theme) => theme.shadows[4],
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: (theme) => theme.shadows[8],
            backgroundColor: (theme) => theme.palette.primary.dark,
          },
        }}
        loading={isLoading}
        disabled={isLoading || _isEmpty(dinerDetail)}
      >
        Complete Reservation
      </Button>
    </Paper>
  );
};

export default Booking;
