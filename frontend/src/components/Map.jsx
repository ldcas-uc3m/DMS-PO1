import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const Map = ({ currentElement, ...otherProps }) => {
  const mapRef = useRef();
  const mapContainerRef = useRef();

  useEffect(() => {
    console.warn('Using a Mapbox map load!');
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-3.70329, 40.416728],
      zoom: 11,
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (currentElement && mapRef.current) {
      if (currentElement.locationPrecise) {
        mapRef.current.flyTo({
          center: currentElement.locationPrecise,
          zoom: 11,
        });
      } else {
        mapRef.current.flyTo({
          zoom: 2,
        });
      }
    }
  }, [currentElement]);

  return <Box id="mapbox-container" ref={mapContainerRef} {...otherProps} />;
};

export default Map;
