import _debounce from "lodash/debounce";

const DELAY = 400;

export const fetchRestaurantList = _debounce(async (searchText) => {
  if (!!searchText) return [];
  try {
  } catch (error) {}
  return [];
}, DELAY);
