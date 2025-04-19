import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  InputAdornment,
} from "@mui/material";

import { formatPhoneForDisplay } from "../../../utils/restaurantManagerFormUtils";
import { US_STATES } from "./constants";

export default function BasicDetailsForm({
  basicDetails,
  phone,
  onChange,
  onPhoneChange,
  onPhoneBlur,
  errors,
  readOnly = false,
}) {
  return (
    <>
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
            value={basicDetails.name}
            onChange={onChange}
            disabled={readOnly}
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
            disabled={readOnly}
          >
            <InputLabel>Cuisine Type</InputLabel>
            <Select
              required
              sx={{ minWidth: "150px" }}
              label="Cuisine Type"
              name="cuisineType"
              value={basicDetails.cuisineType}
              onChange={onChange}
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
        {basicDetails.cuisineType === "Other" && (
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Specify Cuisine Type"
              name="customCuisineType"
              value={basicDetails.customCuisineType}
              onChange={onChange}
              error={!!errors.customCuisineType}
              helperText={errors.customCuisineType}
              disabled={readOnly}
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
            value={basicDetails.addressLine}
            onChange={onChange}
            error={!!errors.addressLine}
            helperText={errors.addressLine}
            disabled={readOnly}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="City"
            name="city"
            value={basicDetails.city}
            onChange={onChange}
            error={!!errors.city}
            helperText={errors.city}
            disabled={readOnly}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
            error={!!errors.state}
            disabled={readOnly}
          >
            <InputLabel>State</InputLabel>
            <Select
              required
              sx={{ minWidth: "100px" }}
              label="State"
              name="state"
              value={basicDetails.state}
              onChange={onChange}
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
            value={basicDetails.zipCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 5);
              onChange({
                target: { name: "zipCode", value },
              });
            }}
            error={!!errors.zipCode}
            helperText={errors.zipCode}
            disabled={readOnly}
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
            disabled={readOnly}
            // If 10 digits are present, display the pretty format;
            // otherwise, show what the user has typed.
            value={phone.length === 10 ? formatPhoneForDisplay(phone) : phone}
            onChange={onPhoneChange}
            onBlur={onPhoneBlur}
            error={!!errors.contactPhone}
            helperText={
              errors.contactPhone || "Enter exactly 10 digits (US number only)"
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
            value={basicDetails.description}
            onChange={onChange}
            error={!!errors.description}
            helperText={errors.description}
            disabled={readOnly}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
            error={!!errors.costRating}
            disabled={readOnly}
          >
            <InputLabel>Cost Rating</InputLabel>
            <Select
              required
              sx={{ minWidth: "150px" }}
              label="Cost Rating"
              name="costRating"
              value={basicDetails.costRating}
              onChange={onChange}
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
    </>
  );
}
