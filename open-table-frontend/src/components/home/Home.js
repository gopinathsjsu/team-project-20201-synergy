import Divider from "@mui/material/Divider";
import NearbySuggestion from "./components/nearbySuggestions/NearbySuggestion";
import ReservationForm from "./components/reservationForm/ReservationForm";

function Home(props) {
  return (
    <div>
      <ReservationForm />
      <Divider />
      <NearbySuggestion />
    </div>
  );
}

export default Home;
