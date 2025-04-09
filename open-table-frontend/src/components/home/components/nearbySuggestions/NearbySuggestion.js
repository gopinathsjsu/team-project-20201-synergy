import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import styles from "./nearbySuggestions.module.scss";

//TODO -> Build RestaurantCard component and use it here.

const data = [
  { id: 1, name: "Restaurant 1", description: "Description 1" },
  { id: 2, name: "Restaurant 2", description: "Description 2" },
  { id: 3, name: "Restaurant 3", description: "Description 3" },
  { id: 4, name: "Restaurant 3", description: "Description 3" },
  { id: 5, name: "Restaurant 3", description: "Description 3" },
  { id: 6, name: "Restaurant 3", description: "Description 3" },
  { id: 7, name: "Restaurant 3", description: "Description 3" },
  { id: 8, name: "Restaurant 3", description: "Description 3" },
  { id: 9, name: "Restaurant 3", description: "Description 3" },
  { id: 10, name: "Restaurant 3", description: "Description 3" },
  // Add more items as needed
];

function NearbySuggestion(props) {
  return (
    <div className={styles.welcomeContainer}>
      <Typography variant="h5" color="initial">
        Welcome to BookTable!!
      </Typography>
      <Typography variant="subtitle1">
        Enjoy booking tables at your favorite local restaurants with ease. Use
        our specialized filters to refine your search and plan your dining
        experience.
      </Typography>
      <Typography variant="h5" color="initial">
        Nearby suggestions
      </Typography>
      <Grid container spacing={4}>
        {data.map((item) => (
          <Grid size={4} item xs={12} sm={6} md={4} key={item.id}>
            <Card className={styles.restaurantCard} raised>
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2">{item.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default NearbySuggestion;
