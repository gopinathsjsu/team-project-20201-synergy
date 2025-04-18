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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import BasicDetailsForm from "../../../components/restaurant-manager/RestaurantForm/BasicDetailsForm";
import OperatingHoursForm from "../../../components/restaurant-manager/RestaurantForm/OperatingHoursForm";
import TableConfigurationsForm from "../../../components/restaurant-manager/RestaurantForm/TableConfigurationsForm";
import PhotoUploadsForm from "../../../components/restaurant-manager/RestaurantForm/PhotoUploadsForm";

import {
  fetchRestaurantDetailsById,
  getBatchPresignedUrls,
  updateRestaurant,
  uploadImageToS3,
  deleteFilesBulk,
} from "../../api/restaurant-manager-api";
import { transformToRestaurantRequest } from "../../../mappers/restaurantRequest";
import {
  formatUSPhoneNumber,
  generateFullTimeOptions,
  generateTimeSlotsBetween,
  convert12To24,
} from "../../../utils/restaurantManagerFormUtils";
import { DAYS_OF_WEEK } from "../../../components/restaurant-manager/RestaurantForm/constants";

export default function EditRestaurant() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState(null);
  const [contactPhoneRaw, setContactPhoneRaw] = useState("");
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  // each item: { file?: File, preview: string, key: string }

  const [initialKeys, setInitialKeys] = useState({ main: "", additionals: [] });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // 1) Load restaurant details
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const r = await fetchRestaurantDetailsById(id);
        // basicDetails
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
        setContactPhoneRaw(
          r.contactPhone.replace(/^\+1/, "").replace(/\D/g, "")
        );

        // operatingHours
        const operatingHours = r.operatingHours.map((h) => {
          const dayName = Object.keys(DAYS_OF_WEEK).find(
            (d) => DAYS_OF_WEEK[d] === h.dayOfWeek
          );
          const all =
            h.openTime && h.closeTime
              ? generateTimeSlotsBetween(h.openTime, h.closeTime)
              : [];
          const sel =
            r.timeSlots.find((t) => t.dayOfWeek === h.dayOfWeek)?.times || [];
          return {
            day: dayName,
            isOpen: !!h.openTime,
            open: h.openTime || "",
            close: h.closeTime || "",
            timeSlots: { allSlots: all, selected: sel },
          };
        });

        // tables
        const tableConfigurations = r.tableConfigurations.map((t) => ({
          size: t.size,
          count: t.quantity,
        }));

        // stash initial S3 keys
        setInitialKeys({
          main: r.mainPhotoUrl,
          additionals: r.additionalPhotoUrls,
        });

        // temp set keys as preview until we fetch real presigned URLs
        setMainImagePreview(null);
        setAdditionalPhotos(
          r.additionalPhotoUrls.map((key) => ({ preview: null, key }))
        );

        // set form data
        setFormData({
          basicDetails,
          operatingHours,
          tableConfigurations,
          mainPhoto: r.mainPhotoUrl, // either string key or File
          additionalPhotos: r.additionalPhotoUrls.map((key) => ({ key })),
        });

        // batch‐fetch GET presigned URLs
        const allKeys = [r.mainPhotoUrl, ...r.additionalPhotoUrls].filter(
          Boolean
        );
        if (allKeys.length > 0) {
          const map = await getBatchPresignedUrls(allKeys);
          setMainImagePreview(map[r.mainPhotoUrl]);
          setAdditionalPhotos(
            r.additionalPhotoUrls.map((key) => ({
              key,
              preview: map[key],
            }))
          );
        }
      } catch (e) {
        setSnackbar({ open: true, message: e.message, severity: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 2) regenerate slots when hours change
  useEffect(() => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev,
      operatingHours: prev.operatingHours.map((day) => {
        if (day.isOpen && day.open && day.close) {
          const all = generateTimeSlotsBetween(day.open, day.close);
          const keep = day.timeSlots.selected.filter((s) => all.includes(s));
          return {
            ...day,
            timeSlots: {
              allSlots: all,
              selected: keep.length ? keep : all,
            },
          };
        }
        return { ...day, timeSlots: { allSlots: [], selected: [] } };
      }),
    }));
  }, [
    formData?.operatingHours
      .map((d) => `${d.isOpen}-${d.open}-${d.close}`)
      .join(),
  ]);

  // Validation for form fields
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

  useEffect(() => {
    if (showErrors) setErrors(validateForm());
  }, [formData, showErrors]);

  // Handle for basic details changes
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

  const handleContactPhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setContactPhoneRaw(digits);
  };

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

  const [newTableSize, setNewTableSize] = useState("");
  const [newTableCount, setNewTableCount] = useState("");

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

  // 4) On Submit:
  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateForm();
    setErrors(v);
    setShowErrors(true);
    if (Object.keys(v).length) return;

    setIsSubmitting(true);
    const newlyUploaded = [];

    try {
      // 4a) mainPhoto
      let mainKey = initialKeys.main;
      if (formData.mainPhoto instanceof File) {
        const { key } = await uploadImageToS3(
          formData.mainPhoto,
          "restaurants/main"
        );
        mainKey = key;
        newlyUploaded.push(key);
      }

      // 4b) additionals
      const finalAdditionals = [];
      for (const p of additionalPhotos) {
        if (p.file) {
          const { key } = await uploadImageToS3(
            p.file,
            "restaurants/additional"
          );
          finalAdditionals.push(key);
          newlyUploaded.push(key);
        } else if (p.key) {
          finalAdditionals.push(p.key);
        }
      }

      // 4c) build payload
      const payload = transformToRestaurantRequest(formData);
      payload.mainPhotoUrl = mainKey;
      payload.additionalPhotoUrls = finalAdditionals;

      // 4d) call backend
      await updateRestaurant(id, payload);
      router.push("/restaurant-manager/dashboard");
    } catch (err) {
      // rollback any newly uploaded
      if (newlyUploaded.length) {
        try {
          await deleteFilesBulk(newlyUploaded);
        } catch (xx) {
          console.error("cleanup failed", xx);
        }
      }
      setSnackbar({ open: true, message: err.message, severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Edit Restaurant
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <BasicDetailsForm
            basicDetails={formData.basicDetails}
            phone={contactPhoneRaw}
            onChange={handleBasicDetailsChange}
            onPhoneChange={handleContactPhoneChange}
            onPhoneBlur={handleContactPhoneBlur}
            errors={errors}
          />

          <OperatingHoursForm
            operatingHours={formData.operatingHours}
            onHourChange={handleOperatingHoursChange}
            onTimeBlur={handleOperatingHourTimeBlur}
            onSlotToggle={handleOperatingHourSlotToggle}
            errors={errors}
          />

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

          <PhotoUploadsForm
            mainPhotoPreview={mainImagePreview}
            onMainPhotoUpload={handlePhotoUpload}
            additionalPhotos={additionalPhotos}
            onAdditionalPhotoUpload={handlePhotoUpload}
            onAdditionalPhotoRemove={removeAdditionalPhoto}
            mainPhotoError={errors.mainPhoto}
            additionalPhotosError={errors.additionalPhotos}
          />

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button variant="outlined" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update"
              )}
            </Button>
          </Box>
        </form>
      </Paper>

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
