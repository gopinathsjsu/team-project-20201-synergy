import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import NearbySuggestion from "./components/nearbySuggestions/NearbySuggestion";
import ReservationForm from "./components/reservationForm/ReservationForm";
import SearchResult from "./components/searchResult/SearchResult";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNearbySuggestions } from "@/hooks/useNearbySuggestions";
import axios from "axios";
import dayjs from "dayjs";
import { getPresignedUrls } from "@/utils/imageUtils";

const DISPLAY_MODE = {
  SUGGESTIONS: "suggestions",
  RESULTS: "results",
};

// Common placeholder image key used throughout the app
const PLACEHOLDER_KEY = "restaurants/main/restaurant-main.jpeg";

function Home(props) {
  const [displayMode, setDisplayMode] = useState(DISPLAY_MODE.SUGGESTIONS);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    date: dayjs().format("YYYY-MM-DD"),
    time: "20:00",
    partySize: 2,
  });
  const [presignedUrls, setPresignedUrls] = useState({});
  const [isLoadingUrls, setIsLoadingUrls] = useState(false);
  const processedImageKeys = useRef(new Set());

  const {
    suggestions,
    loading: isLoading,
    locationError,
  } = useNearbySuggestions();

  // Memoized function to fetch presigned URLs
  const fetchPresignedUrlsBatch = useCallback(
    async (restaurantList) => {
      if (!restaurantList || restaurantList.length === 0 || isLoadingUrls)
        return;

      try {
        setIsLoadingUrls(true);

        // Extract all image keys and filter out already processed ones and null/undefined values
        const imageKeys = restaurantList
          .map((restaurant) => restaurant.mainPhotoUrl)
          .filter(key => key && !processedImageKeys.current.has(key));

        // Skip if we have no new keys to process 
        if (imageKeys.length === 0) {
          setIsLoadingUrls(false);
          return;
        }

        // Mark these keys as processed before making the API call
        // to ensure we don't ask for them again if there's a race condition
        imageKeys.forEach(key => processedImageKeys.current.add(key));

        console.log(
          "Home - Fetching presigned URLs for restaurant images:",
          imageKeys.length
        );
        
        const urls = await getPresignedUrls(imageKeys);
        console.log(
          "Home - Received presigned URLs:",
          Object.keys(urls).length
        );

        setPresignedUrls((prevUrls) => ({
          ...prevUrls,
          ...urls
        }));
      } catch (error) {
        console.error("Error batch fetching presigned URLs:", error);
      } finally {
        setIsLoadingUrls(false);
      }
    },
    [isLoadingUrls]
  );

  // Effect to fetch URLs for nearby suggestions
  useEffect(() => {
    if (suggestions?.length > 0) {
      fetchPresignedUrlsBatch(suggestions);
    }
  }, [suggestions, fetchPresignedUrlsBatch]);

  // Effect to fetch URLs for search results
  useEffect(() => {
    if (searchResults?.length > 0) {
      fetchPresignedUrlsBatch(searchResults);
    }
  }, [searchResults, fetchPresignedUrlsBatch]);

  const handleSearchSubmit = async (searchPayload) => {
    setSearchPayload(searchPayload);
    setIsSearchLoading(true);
    setSearchError(null);
    setSearchResults([]);

    // call search API
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/home/restaurants/search`;
    try {
      const response = await axios.post(url, searchPayload, {
        withCredentials: true,
      });
      const restaurantList = response?.data?.data?.restaurantSearchDetails;
      setSearchResults(restaurantList);
      setDisplayMode(DISPLAY_MODE.RESULTS);
    } catch (err) {
      console.log(err);
      setSearchError(err.message);
    }
    setIsSearchLoading(false);
  };

  const handleSearchPayload = (searchPayload) => {
    setSearchPayload(searchPayload);
  };

  const loader = (
    <Box sx={{ display: "flex", justifyContent: "center", margin: 20 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <div>
      <ReservationForm
        onSearchSubmit={handleSearchSubmit}
        onSearchChange={handleSearchPayload}
      />
      <Divider />
      <Box
        component="header"
        sx={(theme) => ({
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: "#fff",
          textAlign: "center",
          py: { xs: 6, md: 12 },
          px: { xs: 2, md: 4 },
        })}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            letterSpacing: "0.05em",
            lineHeight: 1.2,
            mb: 2,
          }}
        >
          Welcome to BookTable
        </Typography>

        <Typography
          variant="h6"
          component="p"
          sx={{
            maxWidth: 600,
            mx: "auto",
            mb: 4,
            fontWeight: 500,
            opacity: 0.9,
            lineHeight: 1.4,
          }}
        >
          Enjoy booking tables at your favorite local restaurants with ease. Use
          our specialized filters to refine your search and plan your dining
          experience.
        </Typography>
      </Box>
      {displayMode === DISPLAY_MODE.SUGGESTIONS ? (
        isLoading ? (
          loader
        ) : (
          <NearbySuggestion
            restaurantList={suggestions}
            searchPayload={searchPayload}
            presignedUrls={presignedUrls}
          />
        )
      ) : isSearchLoading ? (
        loader
      ) : (
        <SearchResult
          restaurantList={searchResults}
          searchPayload={searchPayload}
          presignedUrls={presignedUrls}
        />
      )}
    </div>
  );
}

export default Home;
