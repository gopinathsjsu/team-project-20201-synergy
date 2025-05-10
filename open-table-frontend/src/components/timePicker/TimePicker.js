import React, { useMemo } from "react";
import { TextField, MenuItem } from "@mui/material";

const TimeSelect = ({ value, onChange, label = "Select Time" }) => {
  // generate [ { label: "8:00 AM", value: "08:00" }, …, { label: "10:00 PM", value: "22:00" } ]
  const timeOptions = useMemo(() => {
    const slots = [];
    for (let mins = 8 * 60; mins <= 22 * 60; mins += 30) {
      const h24 = Math.floor(mins / 60);
      const m = mins % 60;
      const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
      const ampm = h24 < 12 ? "AM" : "PM";
      const label = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
      const value = `${String(h24).padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;
      slots.push({ label, value });
    }
    return slots;
  }, []);

  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={onChange}
      size="small"
      sx={{
        width: 200, // fixed width
        "& .MuiOutlinedInput-root": {
          height: 56, // fixed height
        },
        // optional: vertically center the select text
        "& .MuiSelect-select": {
          display: "flex",
          alignItems: "center",
          height: "100%",
          paddingTop: 0,
          paddingBottom: 0,
        },
      }}
    >
      {timeOptions.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default TimeSelect;
