import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import PlaceIcon from "@mui/icons-material/Place";
import { usePlacesWidget } from "react-google-autocomplete";

function PlacesAutocomplete({ onLocationChange }) {
  const { ref } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_PLACES_API_KEY,
    onPlaceSelected: onLocationChange,
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
      required
    />
  );
}

PlacesAutocomplete.propTypes = {
  onLocationChange: PropTypes.function,
};

PlacesAutocomplete.defaultProps = {
  onLocationChange: () => {},
};

export default PlacesAutocomplete;
