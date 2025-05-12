import Divider from "@mui/material/Divider";
import NearbySuggestion from "./components/nearbySuggestions/NearbySuggestion";
import ReservationForm from "./components/reservationForm/ReservationForm";
import SearchResult from "./components/searchResult/SearchResult";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useState, useEffect, useCallback } from "react";
import { useNearbySuggestions } from "@/hooks/useNearbySuggestions";
import axios from "axios";
import dayjs from "dayjs";
import { getPresignedUrls } from "@/utils/imageUtils";

const DISPLAY_MODE = {
  SUGGESTIONS: "suggestions",
  RESULTS: "results",
};

function Home(props) {
  const [displayMode, setDisplayMode] = useState(DISPLAY_MODE.SUGGESTIONS);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    date: dayjs().format("YYYY-DD-MM"),
    time: "20:00",
    partySize: 2,
  });
  const [presignedUrls, setPresignedUrls] = useState({});
  const [isLoadingUrls, setIsLoadingUrls] = useState(false);

  const {
    suggestions,
    loading: isLoading,
    locationError,
  } = useNearbySuggestions();

  // Memoized function to fetch presigned URLs
  const fetchPresignedUrlsBatch = useCallback(async (restaurantList) => {
    if (!restaurantList || restaurantList.length === 0 || isLoadingUrls) return;
    
    try {
      setIsLoadingUrls(true);
      
      // Extract all image keys
      const imageKeys = restaurantList
        .map(restaurant => restaurant.mainPhotoUrl)
        .filter(Boolean);
      
      if (imageKeys.length === 0) {
        setIsLoadingUrls(false);
        return;
      }
      
      console.log("Home - Fetching presigned URLs for restaurant images:", imageKeys.length);
      const urls = await getPresignedUrls(imageKeys);
      console.log("Home - Received presigned URLs:", Object.keys(urls).length);
      
      setPresignedUrls(prevUrls => {
        // Only add new URLs, don't replace existing ones
        const updatedUrls = { ...prevUrls };
        Object.entries(urls).forEach(([key, url]) => {
          if (url && !updatedUrls[key]) {
            updatedUrls[key] = url;
          }
        });
        return updatedUrls;
      });
    } catch (error) {
      console.error("Error batch fetching presigned URLs:", error);
    } finally {
      setIsLoadingUrls(false);
    }
  }, [isLoadingUrls]);

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
