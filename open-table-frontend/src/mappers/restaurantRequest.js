import { DAYS_OF_WEEK } from "../components/restaurant-manager/RestaurantForm/constants";

export const transformToRestaurantRequest = (state) => {
  const { basicDetails, tableConfigurations, operatingHours } = state;

  // Transform basic details.
  const basicDetailsRequest = {
    name: basicDetails.name,
    cuisineType: basicDetails.cuisineType,
    // If costRating is a string, convert to integer.
    costRating: parseInt(basicDetails.costRating, 10),
    description: basicDetails.description,
    contactPhone: basicDetails.contactPhone,
    addressLine: basicDetails.addressLine,
    city: basicDetails.city,
    state: basicDetails.state,
    zipCode: basicDetails.zipCode,
    country: basicDetails.country,
  };

  // Transform tableConfigurations: rename "count" to "quantity".
  const tableRequests = tableConfigurations.map((config) => ({
    size: config.size,
    quantity: config.count, // Make sure your state key here is consistent.
  }));

  // Transform operating hours 
const hoursDtos = operatingHours.map((hour) => ({
    dayOfWeek: DAYS_OF_WEEK[hour.day],
    openTime: hour.isOpen && hour.open ? hour.open : null,
    closeTime: hour.isOpen && hour.close ? hour.close : null,
  }));

  // Transform timeSlots – include every day.
  const timeSlotDtos = operatingHours.map((hour) => ({
    dayOfWeek: DAYS_OF_WEEK[hour.day],
    times: hour.isOpen && hour.timeSlots ? hour.timeSlots.selected : [],
  }));

  return {
    basicDetails: basicDetailsRequest,
    tableConfigurations: tableRequests,
    operatingHours: hoursDtos,
    timeSlots: timeSlotDtos,
  };
};
