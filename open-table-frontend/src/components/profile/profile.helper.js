import axios from "axios";
import _map from "lodash/map";

export const getRestaurantsById = async (bookings) => {
  const restaurantIds = _map(bookings, (booking) => booking?.restaurantId);
  try {
    const results = await Promise.all(
      _map(restaurantIds, (restaurantId) =>
        axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/home/restaurant/${restaurantId}`
        )
      )
    );
    const restaurantById = _reduce(
      results,
      (acc, response) => {
        const restaurantData = response.data?.data;
        const { id, ...restData } = restaurantData;
        acc[id] = restData;
        return acc;
      },
      {}
    );
    return restaurantById;
  } catch (err) {
    console.error("Error fetching restaurant details concurrently:", err);
  }
};
