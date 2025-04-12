import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import PlaceIcon from "@mui/icons-material/Place";
import { usePlacesWidget } from "react-google-autocomplete";

function PlacesAutocomplete(props) {
  const { ref } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_PLACES_API_KEY,
    onPlaceSelected: (place) => console.log(place),
    inputAutocompleteValue: "country",
    options: {
      componentRestrictions: { country: "us" },
    },
  });
  return (
    <TextField
      label="Enter a location"
      sx={{ width: 250 }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <PlaceIcon />
            </InputAdornment>
          ),
        },
      }}
      inputRef={ref}
    />
  );
}

export default PlacesAutocomplete;
