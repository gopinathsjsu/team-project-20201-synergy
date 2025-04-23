import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";

// Default styling — tweak size as needed
const containerStyle = {
  width: "500px",
  height: "300px",
};

const MapComponent = ({ lat, lng }) => {
  const [map, setMap] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_PLACES_API_KEY,
  });

  const center = { lat, lng };

  const onLoad = useCallback(
    (mapInstance) => {
      setMap(mapInstance);
      mapInstance.panTo(center);
    },
    [center]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={center} />
    </GoogleMap>
  ) : (
    <></>
  );
};

MapComponent.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
};

export default MapComponent;
