import { Box } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import vscTelescope from '../assets/vsc-telescope.svg';

const Map = ({
  currentElement,
  setCurrentElement,
  setCurrentPosition,
  sightings,
  ...otherProps
}) => {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const tearDownMap = setupMap(
      mapContainerRef,
      mapRef,
      setMapLoaded,
      setCurrentPosition,
    );
    return tearDownMap;
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      const unloadMarkers = loadMarkers(mapRef, sightings ? sightings : {});
      return unloadMarkers;
    }
  }, [sightings, mapLoaded]);

  useEffect(() => {
    const removeOnClickFromMap = addOnClickToMap(mapRef, sightings, setCurrentElement);
    return removeOnClickFromMap;
  }, [sightings]);

  useEffect(() => {
    if (currentElement && mapRef.current) {
      updateViewport(mapRef, currentElement);
    }
  }, [currentElement]);

  return <Box id="mapbox-container" ref={mapContainerRef} {...otherProps} />;
};

function setupMap(mapContainerRef, mapRef, setMapLoaded, setCurrentPosition) {
  mapRef.current = new mapboxgl.Map({
    accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
    container: mapContainerRef.current,
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-3.70329, 40.416728],
    zoom: 11,
    crossSourceCollisions: false,
  });
  mapRef.current.on('load', () => setMapLoaded(true));

  mapRef.current.on('mouseenter', 'sightings', () => {
    mapRef.current.getCanvas().style.cursor = 'pointer';
  });

  mapRef.current.on('mouseleave', 'sightings', () => {
    mapRef.current.getCanvas().style.cursor = '';
  });

  mapRef.current.on('moveend', () => {
    const center = mapRef.current.getCenter();
    setCurrentPosition([center.lng, center.lat]);
  });

  return () => {
    setMapLoaded(false);
    mapRef.current.remove();
  };
}

function loadMarkers(mapRef, sightings) {
  let img = new Image(35, 35);
  img.onload = () => mapRef.current.addImage('sightings-marker', img);
  img.src = vscTelescope;

  mapRef.current.addSource('sightings', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: Object.keys(sightings)
        .filter(
          (key) =>
            sightings[key].locationPrecise && sightings[key].locationPrecise.length == 2,
        )
        .map((key) => {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: sightings[key].locationPrecise,
            },
            properties: {
              id: sightings[key].id,
            },
          };
        }),
    },
  });

  mapRef.current.addLayer({
    id: 'sightings',
    type: 'symbol',
    source: 'sightings',
    layout: {
      'icon-image': 'sightings-marker',
    },
  });

  return () => {
    if (mapRef.current) {
      mapRef.current.removeLayer('sightings');
      mapRef.current.removeSource('sightings');
      mapRef.current.removeImage('sightings-marker');
    }
  };
}

function addOnClickToMap(mapRef, sightings, setCurrentElement) {
  const onClickFunction = (e) => {
    const features = mapRef.current.queryRenderedFeatures(e.point, {
      layers: ['sightings'],
    });

    if (!features.length) {
      setCurrentElement(null);
    } else {
      const feature = features[0];
      setCurrentElement({ ...sightings[feature.properties.id] }); // reconstructing object to enforce triggering useEffects even on the same element
    }
  };

  mapRef.current.on('click', onClickFunction);

  return () => {
    if (mapRef.current) mapRef.current.off('click', onClickFunction);
  };
}

function updateViewport(mapRef, currentElement) {
  if (currentElement.locationPrecise && currentElement.locationPrecise.length == 2) {
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

export default Map;
