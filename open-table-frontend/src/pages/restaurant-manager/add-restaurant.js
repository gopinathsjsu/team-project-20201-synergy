import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  formatUSPhoneNumber,
  convert12To24,
  generateFullTimeOptions,
  generateTimeSlotsBetween,
} from "../../utils/restaurantManagerFormUtils";
import BasicDetailsForm from "../../components/restaurant-manager/RestaurantForm/BasicDetailsForm";
import OperatingHoursForm from "../../components/restaurant-manager/RestaurantForm/OperatingHoursForm";
import TableConfigurationsForm from "../../components/restaurant-manager/RestaurantForm/TableConfigurationsForm";
import PhotoUploadsForm from "../../components/restaurant-manager/RestaurantForm/PhotoUploadsForm";
import {
  addRestaurant,
  deleteFilesBulk,
  uploadImageToS3,
} from "../../pages/api/restaurant-manager-api";
import { transformToRestaurantRequest } from "../../mappers/restaurantRequest";

export default function AddRestaurant() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    basicDetails: {
      name: "",
      cuisineType: "",
      customCuisineType: "",
      costRating: "",
      addressLine: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      description: "",
      contactPhone: "",
    },
    operatingHours: [
      {
        day: "Monday",
        isOpen: false,
        open: undefined,
        close: undefined,
        timeSlots: { allSlots: [], selected: [] },
      },
      {
        day: "Tuesday",
        isOpen: false,
        open: undefined,
        close: undefined,
        timeSlots: { allSlots: [], selected: [] },
      },
      {
        day: "Wednesday",
        isOpen: false,
        open: undefined,
        close: undefined,
        timeSlots: { allSlots: [], selected: [] },
      },
      {
        day: "Thursday",
        isOpen: false,
        open: undefined,
        close: undefined,
        timeSlots: { allSlots: [], selected: [] },
      },
      {
        day: "Friday",
        isOpen: false,
        open: undefined,
        close: undefined,
        timeSlots: { allSlots: [], selected: [] },
      },
      {
        day: "Saturday",
        isOpen: false,
        open: undefined,
        close: undefined,
        timeSlots: { allSlots: [], selected: [] },
      },
      {
        day: "Sunday",
        isOpen: false,
        open: undefined,
        close: undefined,
        timeSlots: { allSlots: [], selected: [] },
      },
    ],
    tableConfigurations: [],
    timeSlots: [],
    mainPhoto: null,
    additionalPhotos: [],
  });

  // Error state and a flag to start showing errors live after the first submit
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  const [newTableSize, setNewTableSize] = useState("");
  const [newTableCount, setNewTableCount] = useState("");
  const [contactPhoneRaw, setContactPhoneRaw] = useState("");
  // Separate state for the main photo preview
  const [mainImagePreview, setMainImagePreview] = useState(null);
  // Preview for additional photos is handled by listing file names (or you can enhance that similarly)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Validation function returns an object of errors
  const validateForm = () => {
    const newErrors = {};

    if (!formData.basicDetails.name) newErrors.name = "Name is required";
    if (!formData.basicDetails.cuisineType)
      newErrors.cuisineType = "Cuisine type is required";
    if (
      formData.basicDetails.cuisineType === "Other" &&
      !formData.basicDetails.customCuisineType
    ) {
      newErrors.customCuisineType = "Please specify cuisine type";
    }
    if (!formData.basicDetails.addressLine)
      newErrors.addressLine = "Address is required";
    if (!formData.basicDetails.city) newErrors.city = "City is required";
    if (!formData.basicDetails.state) newErrors.state = "State is required";
    if (!formData.basicDetails.zipCode)
      newErrors.zipCode = "ZIP code is required";
    if (!formData.basicDetails.country)
      newErrors.country = "Country is required";
    if (!formData.basicDetails.contactPhone)
      newErrors.contactPhone = "Phone number is required";
    if (!formData.basicDetails.description)
      newErrors.description = "Description is required";
    if (!formData.basicDetails.costRating)
      newErrors.costRating = "Cost rating is required";

    if (!formData.mainPhoto) newErrors.mainPhoto = "Main photo is required";
    if (formData.additionalPhotos.length > 5) {
      newErrors.additionalPhotos = "Maximum 5 additional photos allowed";
    }
    if (formData.tableConfigurations.length === 0) {
      newErrors.tableConfigurations =
        "At least one table configuration is required";
    }

    let opErrors = [];
    formData.operatingHours.forEach((hour) => {
      if (hour.isOpen) {
        if (!hour.open) {
          opErrors.push(`${hour.day}: Open time is required`);
        }
        if (!hour.close) {
          opErrors.push(`${hour.day}: Close time is required`);
        }
        if (!hour.timeSlots || hour.timeSlots.selected.length === 0) {
          opErrors.push(`${hour.day}: At least one time slot must be selected`);
        }
      }
    });

    if (!formData.operatingHours.some((hour) => hour.isOpen)) {
      opErrors.push("At least one day must be open");
    }

    if (opErrors.length > 0) {
      newErrors.operatingHours = opErrors.join("\n");
    }
    console.log("Errors:", newErrors);
    return newErrors;
  };

  // Live validation effect (once submission has been attempted)
  useEffect(() => {
    if (showErrors) {
      setErrors(validateForm());
    }
  }, [formData, showErrors]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: prev.operatingHours.map((day) => {
        if (day.isOpen && day.open && day.close) {
          const newSlots = generateTimeSlotsBetween(day.open, day.close);
          // Preserve already deselected slots: keep only those that still exist.
          const previousSelected = day.timeSlots?.selected || [];
          const preserved = previousSelected.filter((slot) =>
            newSlots.includes(slot)
          );
          // If none were preserved, default to all new slots.
          const selected = preserved.length > 0 ? preserved : newSlots;
          return {
            ...day,
            timeSlots: { allSlots: newSlots, selected },
          };
        }
        return { ...day, timeSlots: { allSlots: [], selected: [] } };
      }),
    }));
    // Dependency: trigger effect whenever any day's isOpen, open, or close changes.
  }, [
    formData.operatingHours
      .map((d) => `${d.isOpen}-${d.open}-${d.close}`)
      .join(),
  ]);

  // Handler for basic details changes
  const handleBasicDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      basicDetails: {
        ...prev.basicDetails,
        [name]: value,
        ...(name === "cuisineType" && value !== "Other"
          ? { customCuisineType: "" }
          : {}),
      },
    }));
  };

  // Handler for operating hours changes
  const handleOperatingHoursChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: prev.operatingHours.map((item) =>
        item.day === day ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleOperatingHourTimeBlur = (day, field, time12) => {
    // If the user leaves the field empty, leave it as undefined.
    if (!time12.trim()) {
      setFormData((prev) => ({
        ...prev,
        operatingHours: prev.operatingHours.map((item) =>
          item.day === day ? { ...item, [field]: undefined } : item
        ),
      }));
      return;
    }
    const time24 = convert12To24(time12);
    setFormData((prev) => ({
      ...prev,
      operatingHours: prev.operatingHours.map((item) =>
        item.day === day ? { ...item, [field]: time24 } : item
      ),
    }));
  };

  const handleOperatingHourSlotToggle = (day, slot) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: prev.operatingHours.map((item) => {
        if (item.day === day) {
          const selected = item.timeSlots.selected.includes(slot)
            ? item.timeSlots.selected.filter((s) => s !== slot)
            : [...item.timeSlots.selected, slot];
          return {
            ...item,
            timeSlots: {
              ...item.timeSlots,
              selected,
            },
          };
        }
        return item;
      }),
    }));
  };

  // onChange: Remove non-digit characters and limit input to 10 digits.
  const handleContactPhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setContactPhoneRaw(digits);
  };

  // onBlur: Validate that there are exactly 10 digits.
  // If valid, update canonical value in formData.basicDetails.contactPhone.
  const handleContactPhoneBlur = () => {
    if (contactPhoneRaw.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        contactPhone: "Please enter exactly 10 digits",
      }));
    } else {
      setErrors((prev) => {
        const { contactPhone, ...rest } = prev;
        return rest;
      });
      const canonical = formatUSPhoneNumber(contactPhoneRaw);
      setFormData((prev) => ({
        ...prev,
        basicDetails: {
          ...prev.basicDetails,
          contactPhone: canonical,
        },
      }));
    }
  };

  const onTableSizeChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setNewTableSize("");
    } else {
      const num = parseInt(val, 10);
      if (num > 0) {
        setNewTableSize(num);
      } else {
        setNewTableSize("");
      }
    }
  };

  const onTableCountChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setNewTableCount("");
    } else {
      const num = parseInt(val, 10);
      if (num > 0) {
        setNewTableCount(num);
      } else {
        setNewTableCount("");
      }
    }
  };

  const addTableConfiguration = () => {
    if (
      newTableSize &&
      newTableCount &&
      newTableSize > 0 &&
      newTableCount > 0
    ) {
      setFormData((prev) => ({
        ...prev,
        tableConfigurations: [
          ...prev.tableConfigurations,
          {
            size: parseInt(newTableSize, 10),
            count: parseInt(newTableCount, 10),
          },
        ],
      }));
      // Explicitly remove the error for table configurations once one is added
      setErrors((prev) => {
        const { tableConfigurations, ...rest } = prev;
        return rest;
      });
      setNewTableSize("");
      setNewTableCount("");
    }
  };

  const removeTableConfiguration = (index) => {
    setFormData((prev) => ({
      ...prev,
      tableConfigurations: prev.tableConfigurations.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // Photo upload handler for main photo and additional photos.
  // For additional photos, we now generate a preview URL for each photo.
  const handlePhotoUpload = (e, isMain) => {
    const files = Array.from(e.target.files);
    if (isMain && files.length > 0) {
      setFormData((prev) => ({ ...prev, mainPhoto: files[0] }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else if (!isMain) {
      // Map each file to an object that contains the file and a preview URL.
      const newPhotos = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setFormData((prev) => ({
        ...prev,
        additionalPhotos: [...prev.additionalPhotos, ...newPhotos].slice(0, 5),
      }));
    }
  };

  // When removing an additional photo, revoke its preview URL.
  const removeAdditionalPhoto = (index) => {
    setFormData((prev) => {
      const updatedPhotos = prev.additionalPhotos.filter((_, i) => i !== index);
      // Revoke the object URL for the removed photo.
      URL.revokeObjectURL(prev.additionalPhotos[index].preview);
      return { ...prev, additionalPhotos: updatedPhotos };
    });
  };

  // Generate time slots when operating hours change
  useEffect(() => {
    const slots = [];
    formData.operatingHours.forEach((day) => {
      if (day.isOpen) {
        const daySlots = generateFullTimeOptions(day.open, day.close);
        slots.push(...daySlots.map((slot) => ({ ...slot, day: day.day })));
      }
    });
    setFormData((prev) => ({ ...prev, timeSlots: slots }));
  }, [formData.operatingHours]);

  // On submit, force validation and then check errors
  const handleSubmit = async (e) => {
    console.log("Form data before validation:", formData);
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);
    setShowErrors(true);

    if (Object.keys(newErrors).length !== 0) return;

    setIsSubmitting(true);

    let uploadedImagesKeys = [];

    try {
      // --- Image Upload Section ---
      if (!formData.mainPhoto) {
        throw new Error("Main photo is required");
      }

      const mainPhotoUploadResult = await uploadImageToS3(
        formData.mainPhoto,
        "restaurants/main"
      );
      // Assume uploadImageToS3 returns an object { url, key }.
      uploadedImagesKeys.push(mainPhotoUploadResult.key);
      const mainPhotoUrl = mainPhotoUploadResult.key;

      // Upload any additional photos (if present).
      let additionalPhotoUrls = [];
      for (let photoObj of formData.additionalPhotos) {
        const additionalUploadResult = await uploadImageToS3(
          photoObj.file,
          "restaurants/additional"
        );
        uploadedImagesKeys.push(additionalUploadResult.key);
        additionalPhotoUrls.push(additionalUploadResult.key);
      }

      // --- Construct Payload ---
      const payload = transformToRestaurantRequest(formData);
      payload.mainPhotoUrl = mainPhotoUrl;
      payload.additionalPhotoUrls = additionalPhotoUrls;

      // --- API Call for Adding Restaurant ---
      const result = await addRestaurant(payload);

      setIsSubmitting(false);
      router.push("/restaurant-manager/dashboard");
    } catch (error) {
      // If any error occurs, attempt to clean up the already uploaded images.
      if (uploadedImagesKeys.length > 0) {
        try {
          await deleteFilesBulk(uploadedImagesKeys);
        } catch (cleanupError) {
          console.error("Error cleaning up S3 uploads:", cleanupError);
        }
      }
      setIsSubmitting(false);
      // Display error message via Snackbar.
      setSnackbar({
        open: true,
        message: error.message || "Failed to register restaurant",
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Restaurant Registration
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            {/* Restaurant Information Section */}
            <BasicDetailsForm
              basicDetails={formData.basicDetails}
              phone={contactPhoneRaw}
              onPhoneChange={handleContactPhoneChange}
              onPhoneBlur={handleContactPhoneBlur}
              errors={errors}
              onChange={handleBasicDetailsChange}
            />

            {/* Operating Hours Section */}
            <OperatingHoursForm
              operatingHours={formData.operatingHours}
              onHourChange={handleOperatingHoursChange}
              onTimeBlur={handleOperatingHourTimeBlur}
              onSlotToggle={handleOperatingHourSlotToggle}
              errors={errors}
            />

            {/* Table Configurations Section */}
            <TableConfigurationsForm
              tableConfigurations={formData.tableConfigurations}
              newTableSize={newTableSize}
              newTableCount={newTableCount}
              onSizeChange={onTableSizeChange}
              onCountChange={onTableCountChange}
              onAdd={addTableConfiguration}
              onRemove={removeTableConfiguration}
              error={errors.tableConfigurations}
            />

            {/* Photo Upload Section */}
            <PhotoUploadsForm
              mainPhotoPreview={mainImagePreview}
              onMainPhotoUpload={handlePhotoUpload}
              mainPhotoError={errors.mainPhoto}
              additionalPhotos={formData.additionalPhotos}
              onAdditionalPhotoUpload={handlePhotoUpload}
              onAdditionalPhotoRemove={removeAdditionalPhoto}
              additionalPhotosError={errors.additionalPhotos}
            />

            {/* Form Actions */}
            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => router.push("/restaurant-manager/dashboard")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Register"
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
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
