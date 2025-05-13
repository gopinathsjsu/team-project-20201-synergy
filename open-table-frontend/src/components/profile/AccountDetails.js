import { Typography, Box, Paper, Divider, TextField, InputAdornment } from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

export default function AccountDetails({ profile }) {
  return (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="500" sx={{ mb: 3 }}>
        About me
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Your information entered here will be shared with restaurants when you make a booking.
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 1 }}>
          First name
        </Typography>
        <TextField
          value={profile.firstName || ""}
          fullWidth
          variant="outlined"
          disabled
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
            }
          }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 1 }}>
          Last name
        </Typography>
        <TextField
          value={profile.lastName || ""}
          fullWidth
          variant="outlined"
          disabled
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
            }
          }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 1 }}>
          Email address
        </Typography>
        <TextField
          value={profile.email || ""}
          type="email"
          fullWidth
          variant="outlined"
          disabled
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
            }
          }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 1 }}>
          Phone
        </Typography>
        <TextField
          value={profile.phoneNumber || ""}
          fullWidth
          variant="outlined"
          disabled
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
            }
          }}
        />
      </Box>
    </Paper>
  );
}
