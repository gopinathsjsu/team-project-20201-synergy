import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  InputLabel,
  Select,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  MenuItem,
  Paper,
  Checkbox,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Alert,
  FormControl,
  FormHelperText,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import {
  formatUSPhoneNumber,
  formatPhoneForDisplay,
  convert12To24,
  convert24To12,
  generateFullTimeOptions,
  generateTimeSlotsBetween,
} from "../../utils/restaurantManagerFormUtils";

const DAYS_OF_WEEK = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const US_STATES = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [contactPhoneRaw, setContactPhoneRaw] = useState("");
  // Separate state for the main photo preview
  const [mainImagePreview, setMainImagePreview] = useState(null);
  // Preview for additional photos is handled by listing file names (or you can enhance that similarly)

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
      operatingHours: prev.operatingHours.map((hour) =>
        hour.day === day
          ? field === "isOpen" && value === false
            ? { ...hour, isOpen: false, open: undefined, close: undefined }
            : { ...hour, [field]: value }
          : hour
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
    console.log("Form data:", formData);
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    setShowErrors(true);
    if (Object.keys(newErrors).length !== 0) return;

    // TODO: Implement API call to add restaurant
    console.log("Form submitted:", formData);
    // router.push('/restaurant-manager/dashboard');
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
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Restaurant Name"
                  name="name"
                  value={formData.basicDetails.name}
                  onChange={handleBasicDetailsChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{ marginBottom: 2 }}
                  error={!!errors.cuisineType}
                >
                  <InputLabel>Cuisine Type</InputLabel>
                  <Select
                    required
                    sx={{ minWidth: "150px" }}
                    label="Cuisine Type"
                    name="cuisineType"
                    value={formData.basicDetails.cuisineType}
                    onChange={handleBasicDetailsChange}
                  >
                    <MenuItem value="">
                      <em>Select Cuisine Type</em>
                    </MenuItem>
                    <MenuItem value="Italian">Italian</MenuItem>
                    <MenuItem value="Mexican">Mexican</MenuItem>
                    <MenuItem value="Chinese">Chinese</MenuItem>
                    <MenuItem value="Indian">Indian</MenuItem>
                    <MenuItem value="American">American</MenuItem>
                    <MenuItem value="Japanese">Japanese</MenuItem>
                    <MenuItem value="Korean">Korean</MenuItem>
                    <MenuItem value="Thai">Thai</MenuItem>
                    <MenuItem value="Vietnamese">Vietnamese</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.cuisineType}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {formData.basicDetails.cuisineType === "Other" && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Specify Cuisine Type"
                    name="customCuisineType"
                    value={formData.basicDetails.customCuisineType}
                    onChange={handleBasicDetailsChange}
                    error={!!errors.customCuisineType}
                    helperText={errors.customCuisineType}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  variant="outlined"
                  sx={{ marginBottom: 2 }}
                  label="Address Line"
                  name="addressLine"
                  value={formData.basicDetails.addressLine}
                  onChange={handleBasicDetailsChange}
                  error={!!errors.addressLine}
                  helperText={errors.addressLine}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.basicDetails.city}
                  onChange={handleBasicDetailsChange}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{ marginBottom: 2 }}
                  error={!!errors.state}
                >
                  <InputLabel>State</InputLabel>
                  <Select
                    required
                    sx={{ minWidth: "100px" }}
                    label="State"
                    name="state"
                    value={formData.basicDetails.state}
                    onChange={handleBasicDetailsChange}
                  >
                    <MenuItem value="">
                      <em>Select State</em>
                    </MenuItem>
                    {Object.entries(US_STATES).map(([abbr, name]) => (
                      <MenuItem key={abbr} value={abbr}>
                        {name} ({abbr})
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.state}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="ZIP Code"
                  name="zipCode"
                  value={formData.basicDetails.zipCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                    handleBasicDetailsChange({
                      target: { name: "zipCode", value },
                    });
                  }}
                  error={!!errors.zipCode}
                  helperText={errors.zipCode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Country"
                  name="country"
                  value="USA"
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Contact Number"
                  name="contactPhone"
                  // If 10 digits are present, display the pretty format;
                  // otherwise, show what the user has typed.
                  value={
                    contactPhoneRaw.length === 10
                      ? formatPhoneForDisplay(contactPhoneRaw)
                      : contactPhoneRaw
                  }
                  onChange={handleContactPhoneChange}
                  onBlur={handleContactPhoneBlur}
                  error={!!errors.contactPhone}
                  helperText={
                    errors.contactPhone ||
                    "Enter exactly 10 digits (US number only)"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+1</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.basicDetails.description}
                  onChange={handleBasicDetailsChange}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{ marginBottom: 2 }}
                  error={!!errors.costRating}
                >
                  <InputLabel>Cost Rating</InputLabel>
                  <Select
                    required
                    sx={{ minWidth: "150px" }}
                    label="Cost Rating"
                    name="costRating"
                    value={formData.basicDetails.costRating}
                    onChange={handleBasicDetailsChange}
                  >
                    <MenuItem value="">
                      <em>Select Cost Rating</em>
                    </MenuItem>
                    <MenuItem value={1}>$</MenuItem>
                    <MenuItem value={2}>$$</MenuItem>
                    <MenuItem value={3}>$$$</MenuItem>
                    <MenuItem value={4}>$$$$</MenuItem>
                  </Select>
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.costRating}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            {/* Operating Hours Section */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Operating Hours
            </Typography>
            <Grid container spacing={2}>
              {formData.operatingHours.map((hour) => (
                <Grid item xs={12} key={hour.day}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={hour.isOpen}
                          onChange={(e) =>
                            handleOperatingHoursChange(
                              hour.day,
                              "isOpen",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label={
                        hour.day.charAt(0).toUpperCase() + hour.day.slice(1)
                      }
                    />
                    {hour.isOpen && (
                      <>
                        <TextField
                          select
                          label="Open"
                          value={hour.open || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              operatingHours: prev.operatingHours.map((item) =>
                                item.day === hour.day
                                  ? { ...item, open: e.target.value }
                                  : item
                              ),
                            }))
                          }
                          onBlur={(e) =>
                            handleOperatingHourTimeBlur(
                              hour.day,
                              "open",
                              e.target.value
                            )
                          }
                          sx={{ minWidth: 120 }}
                        >
                          {generateFullTimeOptions().map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.display}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          select
                          label="Close"
                          value={hour.close || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              operatingHours: prev.operatingHours.map((item) =>
                                item.day === hour.day
                                  ? { ...item, close: e.target.value }
                                  : item
                              ),
                            }))
                          }
                          onBlur={(e) =>
                            handleOperatingHourTimeBlur(
                              hour.day,
                              "close",
                              e.target.value
                            )
                          }
                          sx={{ minWidth: 120 }}
                        >
                          {generateFullTimeOptions().map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.display}
                            </MenuItem>
                          ))}
                        </TextField>
                      </>
                    )}
                    {hour.isOpen &&
                      hour.timeSlots &&
                      hour.timeSlots.allSlots.length > 0 && (
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          {hour.timeSlots.allSlots.map((slot) => {
                            const isSelected =
                              hour.timeSlots.selected.includes(slot);
                            return (
                              <Chip
                                key={slot}
                                label={convert24To12(slot)}
                                color={isSelected ? "primary" : "default"}
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    operatingHours: prev.operatingHours.map(
                                      (item) => {
                                        if (item.day === hour.day) {
                                          const selected =
                                            item.timeSlots.selected.includes(
                                              slot
                                            )
                                              ? item.timeSlots.selected.filter(
                                                  (s) => s !== slot
                                                )
                                              : [
                                                  ...item.timeSlots.selected,
                                                  slot,
                                                ];
                                          return {
                                            ...item,
                                            timeSlots: {
                                              ...item.timeSlots,
                                              selected,
                                            },
                                          };
                                        }
                                        return item;
                                      }
                                    ),
                                  }));
                                }}
                              />
                            );
                          })}
                        </Box>
                      )}
                  </Box>
                </Grid>
              ))}
            </Grid>
            {errors.operatingHours && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.operatingHours.split("\n").map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </Alert>
            )}
            {/* Table Configurations Section */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Table Configurations
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Table Size"
                  value={newTableSize}
                  onChange={(e) => {
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
                  }}
                  slotProps={{
                    input: { min: 1 },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Tables"
                  value={newTableCount}
                  onChange={(e) => {
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
                  }}
                  slotProps={{
                    input: { min: 1 },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={addTableConfiguration}
                  disabled={newTableSize === "" || newTableCount === ""} // Only enabled when both are non-empty.
                >
                  Add Table Configuration
                </Button>
              </Grid>
            </Grid>
            {errors.tableConfigurations && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.tableConfigurations}
              </Alert>
            )}

            <List>
              {formData.tableConfigurations.map((config, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => removeTableConfiguration(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`${config.size} seats - ${config.count} tables`}
                  />
                </ListItem>
              ))}
            </List>

            {/* Photo Upload Section */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Photos
            </Typography>
            <Grid container spacing={2}>
              {/* Main Photo Upload */}
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Main Photo (Required)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Main Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, true)}
                  />
                </Button>
                {mainImagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Preview:
                    </Typography>
                    <img
                      src={mainImagePreview}
                      alt="Main photo preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                )}
                {errors.mainPhoto && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.mainPhoto}
                  </Alert>
                )}
              </Grid>

              {/* Additional Photos Upload */}
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Additional Photos (Up to 5)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Additional Photos
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={(e) => handlePhotoUpload(e, false)}
                  />
                </Button>
                {errors.additionalPhotos && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.additionalPhotos}
                  </Alert>
                )}
                {/* Display each additional photo preview as a thumbnail */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  {formData.additionalPhotos.map((photoObj, index) => (
                    <Box key={index} sx={{ position: "relative" }}>
                      <img
                        src={photoObj.preview}
                        alt={`Additional photo ${index + 1}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeAdditionalPhoto(index)}
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          backgroundColor: "rgba(255,255,255,0.7)",
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>

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
              >
                Register
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
