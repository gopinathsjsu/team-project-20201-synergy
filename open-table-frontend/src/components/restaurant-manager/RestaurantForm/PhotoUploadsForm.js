// components/RestaurantForm/PhotoUploadsForm.js
import {
  Grid,
  Typography,
  Button,
  Box,
  Alert,
  IconButton,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

export default function PhotoUploadsForm({
  mainPhotoPreview,
  onMainPhotoUpload,
  mainPhotoError,
  additionalPhotos,
  onAdditionalPhotoUpload,
  onAdditionalPhotoRemove,
  additionalPhotosError,
  readOnly = false,
}) {
  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Photos
      </Typography>
      <Grid container spacing={2}>
        {/* Main Photo Upload */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">Main Photo (Required)</Typography>
          {!readOnly && (
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
                onChange={(e) => onMainPhotoUpload(e, true)}
              />
            </Button>
          )}
          {mainPhotoPreview && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Preview:
              </Typography>
              <img
                src={mainPhotoPreview}
                alt="Main photo preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
          {mainPhotoError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {mainPhotoError}
            </Alert>
          )}
        </Grid>

        {/* Additional Photos Upload */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Additional Photos (Up to 5)
          </Typography>
          {!readOnly && (
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
                onChange={(e) => onAdditionalPhotoUpload(e, false)}
              />
            </Button>
          )}
          {additionalPhotosError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {additionalPhotosError}
            </Alert>
          )}

          {/* Display each additional photo preview as a thumbnail */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            {additionalPhotos.map((photoObj, index) => (
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
                {!readOnly && (
                  <IconButton
                    size="small"
                    onClick={() => onAdditionalPhotoRemove(index)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
