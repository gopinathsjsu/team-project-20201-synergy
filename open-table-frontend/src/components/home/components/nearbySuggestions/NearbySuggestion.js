import { Container, Box, Grid, Typography, Divider } from "@mui/material";
import _size from "lodash/size";
import styles from "./nearbySuggestions.module.scss";
import RestaurantCard from "@/components/restaurantCard";

function NearbySuggestion({
  restaurantList,
  searchPayload,
  presignedUrls = {},
}) {
  if (!_size(restaurantList)) return <h2>No restaurants found...</h2>;
  return (
    <div className={styles.welcomeContainer}>
      <Container maxWidth="lg">
        <Box
          pt={{ xs: 3, md: 4 }}
          pb={{ xs: 2, md: 3 }}
          px={{ xs: 2, md: 4 }}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
          }}
          marginBottom={4}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              letterSpacing: "0.03em",
              color: "text.primary",
            }}
          >
            Nearby Suggestions
          </Typography>
          <Divider
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: "primary.main",
              mb: { xs: 2, md: 3 },
            }}
          />
        </Box>

        <Box pb={4}>
          <Grid
            container
            justifyContent="space-between"
            spacing={4}
            alignItems="stretch"
          >
            {restaurantList.map((restaurant) => (
              <Grid
                item
                key={restaurant.id}
                xs={12}
                sm={6}
                md={3}
                sx={{
                  display: "flex", // make Grid item a flex container
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1, // fill height
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: (theme) => theme.shadows[4],
                    },
                  }}
                >
                  <RestaurantCard
                    restaurant={restaurant}
                    searchPayload={searchPayload}
                    presignedUrls={presignedUrls}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  );
}

export default NearbySuggestion;
