// pages/restaurant-manager/view-restaurant/[id].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import BasicDetailsForm from "../../../components/restaurant-manager/RestaurantForm/BasicDetailsForm";
import OperatingHoursForm from "../../../components/restaurant-manager/RestaurantForm/OperatingHoursForm";
import TableConfigurationsForm from "../../../components/restaurant-manager/RestaurantForm/TableConfigurationsForm";
import PhotoUploadsForm from "../../../components/restaurant-manager/RestaurantForm/PhotoUploadsForm";

import {
  fetchRestaurantDetailsById,
  getBatchPresignedUrls,
} from "../../api/restaurant-manager-api";

import {
  formatUSPhoneNumber,
  generateTimeSlotsBetween,
} from "../../../utils/restaurantManagerFormUtils";
import { DAYS_OF_WEEK_REVERSE } from "../../../components/restaurant-manager/RestaurantForm/constants";

export default function ViewRestaurant() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState(null);
  const [presignedMap, setPresignedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // 1) Fetch raw restaurant DTO
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const result = await fetchRestaurantDetailsById(id);
        const r = result; // your API helper returns the inner data
        // 2) build nested formData
        const basicDetails = {
          name: r.name,
          cuisineType: r.cuisineType,
          customCuisineType: "",
          costRating: r.costRating,
          addressLine: r.addressLine,
          city: r.city,
          state: r.state,
          zipCode: r.zipCode,
          country: r.country,
          description: r.description,
          contactPhone: r.contactPhone,
        };

        const operatingHours = r.operatingHours.map((h) => {
          const dayName = DAYS_OF_WEEK_REVERSE[h.dayOfWeek];
          const allSlots = h.openTime && h.closeTime
            ? generateTimeSlotsBetween(h.openTime, h.closeTime)
            : [];
          const selected =
            r.timeSlots.find((t) => t.dayOfWeek === h.dayOfWeek)?.times ||
            [];
          return {
            day: dayName,
            isOpen: Boolean(h.openTime),
            open: h.openTime || "",
            close: h.closeTime || "",
            timeSlots: { allSlots, selected },
          };
        });

        console.log("r.tableConfigurations", r.tableConfigurations);
        const tableConfigurations = (r.tableConfigurations || []).map(({ size, quantity }) => ({
              size,
              count: quantity,
        }));

        console.log("tableConfigurations", tableConfigurations);

        setFormData({
          basicDetails,
          operatingHours,
          tableConfigurations,
          mainPhoto: r.mainPhotoUrl,
          additionalPhotos:
            r.additionalPhotoUrls?.map((url) => ({ preview: url })) || [],
        });
      } catch (e) {
        setSnackbar({ open: true, message: e.message, severity: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 3) fetch GET presigned URLs in batch
  useEffect(() => {
    if (!formData) return;
    const keys = [formData.mainPhoto]
      .concat(formData.additionalPhotos.map((p) => p.preview))
      .filter(Boolean);
    if (keys.length === 0) return;
    (async () => {
      try {
        const map = await getBatchPresignedUrls(keys);
        setPresignedMap(map);
      } catch (e) {
        setSnackbar({ open: true, message: e.message, severity: "error" });
      }
    })();
  }, [formData]);

  if (loading || !formData) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mb: 6 }}>
      <Box sx={{ my: 4, display: "flex", alignItems: "center" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()}>
          Back
        </Button>
        <Typography variant="h4" sx={{ ml: 2 }}>
          View Restaurant
        </Typography>
      </Box>

      <BasicDetailsForm
        basicDetails={formData.basicDetails}
        phone={formData.basicDetails.contactPhone.replace(/^\+1/, "")}
        onChange={() => {}}
        onPhoneChange={() => {}}
        onPhoneBlur={() => {}}
        errors={{}}
        readOnly
      />

      <OperatingHoursForm
        operatingHours={formData.operatingHours}
        onHourChange={() => {}}
        onTimeBlur={() => {}}
        onSlotToggle={() => {}}
        errors={{}}
        readOnly
      />

      <TableConfigurationsForm
        tableConfigurations={formData.tableConfigurations}
        newTableSize=""
        newTableCount=""
        onSizeChange={() => {}}
        onCountChange={() => {}}
        onAdd={() => {}}
        onRemove={() => {}}
        error={null}
        readOnly
      />

      <PhotoUploadsForm
        mainPhotoPreview={presignedMap[formData.mainPhoto] || null}
        additionalPhotos={formData.additionalPhotos.map((p) => ({
          preview: presignedMap[p.preview] || "",
        }))}
        onMainPhotoUpload={() => {}}
        onAdditionalPhotoUpload={() => {}}
        onAdditionalPhotoRemove={() => {}}
        mainPhotoError={null}
        additionalPhotosError={null}
        readOnly
      />

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
