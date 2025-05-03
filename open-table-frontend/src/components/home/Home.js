import Divider from "@mui/material/Divider";
import NearbySuggestion from "./components/nearbySuggestions/NearbySuggestion";
import ReservationForm from "./components/reservationForm/ReservationForm";
import SearchResult from "./components/searchResult/SearchResult";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useNearbySuggestions } from "@/hooks/useNearbySuggestions";
import axios from "axios";
import dayjs from "dayjs";

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

  const { suggestions, isLoading, error, locationError } =
    useNearbySuggestions();

  const handleSearchSubmit = async (searchPayload) => {
    // console.log("Search triggered with form data:", searchPayload);
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
          />
        )
      ) : isSearchLoading ? (
        loader
      ) : (
        <SearchResult
          restaurantList={searchResults}
          searchPayload={searchPayload}
        />
      )}
    </div>
  );
}

export default Home;
