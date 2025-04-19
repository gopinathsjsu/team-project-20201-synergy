import {
  Typography,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

export default function TableConfigurationsForm({
  tableConfigurations,
  newTableSize,
  newTableCount,
  onSizeChange,
  onCountChange,
  onAdd,
  onRemove,
  error,
  readOnly = false,
}) {
  console.log(tableConfigurations);
  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Table Configurations
      </Typography>
      {!readOnly && (<Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="number"
            label="Table Size"
            value={newTableSize}
            onChange={onSizeChange}
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
            onChange={onCountChange}
            slotProps={{
              input: { min: 1 },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            onClick={onAdd}
            disabled={newTableSize === "" || newTableCount === ""}
          >
            Add Table Configuration
          </Button>
        </Grid>
      </Grid>)}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <List>
        {tableConfigurations.map((config, index) => (
          <ListItem
            key={index}
            secondaryAction={
              !readOnly && (
                <IconButton edge="end" onClick={() => onRemove(index)}>
                  <DeleteIcon />
                </IconButton>
              )
            }
          >
            <ListItemText
              primary={`${config.size} seats - ${config.count} tables`}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}
