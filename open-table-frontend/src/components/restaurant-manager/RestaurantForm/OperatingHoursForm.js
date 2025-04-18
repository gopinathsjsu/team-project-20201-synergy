import { Grid, Box, TextField, MenuItem, Checkbox, FormControlLabel, Alert, Chip, Typography } from "@mui/material";
import { convert24To12, generateFullTimeOptions } from "../../../utils/restaurantManagerFormUtils";

export default function OperatingHoursForm({ operatingHours, onHourChange, onTimeBlur, onSlotToggle, errors, readOnly = false }) {
  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Operating Hours
      </Typography>
      <Grid container spacing={2}>
        {operatingHours.map((hour) => (
          <Grid item xs={12} key={hour.day}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hour.isOpen}
                    onChange={(e) => !readOnly && onHourChange(hour.day, "isOpen", e.target.checked)}
                  />
                }
                label={hour.day.charAt(0).toUpperCase() + hour.day.slice(1)}
              />
              {(hour.isOpen || readOnly) && (
                <>
                  <TextField
                    select
                    label="Open"
                    value={hour.open || ""}
                    onChange={(e) => !readOnly && onHourChange(hour.day, "open", e.target.value)}
                    onBlur={(e) => !readOnly && onTimeBlur(hour.day, "open", e.target.value)}
                    disabled={readOnly}
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
                    onChange={(e) => !readOnly && onHourChange(hour.day, "close", e.target.value)}
                    onBlur={(e) => !readOnly && onTimeBlur(hour.day, "close", e.target.value)}
                    disabled={readOnly}
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
              {hour.isOpen && hour.timeSlots && hour.timeSlots.allSlots.length > 0 && (
                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {hour.timeSlots.allSlots.map((slot) => {
                    const isSelected = hour.timeSlots.selected.includes(slot);
                    return (
                      <Chip
                        key={slot}
                        label={convert24To12(slot)}
                        color={isSelected ? "primary" : "default"}
                        onClick={() => !readOnly && onSlotToggle(hour.day, slot)}
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
    </>
  );
}
