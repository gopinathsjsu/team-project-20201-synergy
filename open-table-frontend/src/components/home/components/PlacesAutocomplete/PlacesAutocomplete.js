import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
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
  return <TextField sx={{ width: 250 }} inputRef={ref} />;
}

export default PlacesAutocomplete;
