import { useEffect, useState } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import Map from './components/Map';
import ObjectList from './components/ObjectList';
import ObjectDetails from './components/ObjectDetails';

function App() {
  const [showElements, setShowElements] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [sightings, setSightings] = useState(null);
  const [events, setEvents] = useState(null);
  useEffect(() => {
    loadElements(setSightings, setEvents);
  }, []);

  const [currentElement, setCurrentElement] = useState(null);
  const [currentPosition, setCurrentPosition] = useState([-3.70329, 40.416728]);

  useEffect(() => {
    if (currentElement) {
      setShowDetails(true);
    } else {
      setShowDetails(false);
    }
  }, [currentElement]);

  return (
    <Box h="100vh" position="relative">
      <Map
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        currentElement={currentElement}
        setCurrentElement={setCurrentElement}
        setCurrentPosition={setCurrentPosition}
        sightings={sightings}
      />
      <Flex
        position="absolute"
        top="0"
        left="0"
        width="50%"
        height="100%"
        zIndex="10"
        direction="column"
        align="start"
        gap="4"
        p="4"
        pointerEvents="none"
      >
        <Button
          size="sm"
          rounded="xl"
          pointerEvents="auto"
          onClick={() => setShowElements((s) => !s)}
        >
          All Events and Sightings
          {showElements ? <FaAngleLeft /> : <FaAngleRight />}
        </Button>
        {showElements && (
          <ObjectList
            w="40%"
            minW="20rem"
            flex="1"
            sightings={sightings}
            events={events}
            currentElement={currentElement}
            setCurrentElement={setCurrentElement}
            currentPosition={currentPosition}
            pointerEvents="auto"
          />
        )}
      </Flex>
      <Flex
        position="absolute"
        top="0"
        right="0"
        width="50%"
        height="100%"
        zIndex="10"
        direction="column"
        align="end"
        gap="4"
        p="4"
        pointerEvents="none"
      >
        <Button
          size="sm"
          rounded="xl"
          pointerEvents="auto"
          onClick={() => setShowDetails((s) => !s)}
        >
          {showDetails ? <FaAngleRight /> : <FaAngleLeft />}
          Show Details
        </Button>
        {showDetails && (
          <ObjectDetails
            w="40%"
            minW="20rem"
            flex="1"
            element={currentElement}
            pointerEvents="auto"
          />
        )}
      </Flex>
    </Box>
  );
}

export default App;

async function loadElements(setSightings, setEvents) {
  function keysSnakeToCamel(object) {
    function snakeToCamel(str) {
      return str
        .toLowerCase()
        .replace(/([-_][a-z])/g, (group) => group.slice(-1).toUpperCase());
    }

    return Object.fromEntries(
      Object.entries(object).map(([k, v]) => [snakeToCamel(k), v]),
    );
  }

  try {
    const response = await fetch('http://localhost:8000/sightings');
    if (!response.ok) {
      throw new Error(`Response status ${response.status}`);
    }

    const sightings = {};
    const sightingsList = await response.json();
    sightingsList.map((sighting) => {
      sighting.id = sighting._id.$oid;
      Object.keys(sighting).forEach((key) => {
        if (!sighting[key]) delete sighting[key];
      });
      delete sighting._id;
      if (sighting.time_event)
        sighting.time_event = new Date(sighting.time_event * 1000).toLocaleDateString(
          'en-EN',
          { day: 'numeric', month: 'long', year: 'numeric' },
        );
      if (sighting.time_post)
        sighting.time_post = new Date(sighting.time_post * 1000).toLocaleDateString(
          'en-EN',
          { day: 'numeric', month: 'long', year: 'numeric' },
        );
      if (sighting.distance) sighting.distance = `${sighting.distance} m`;
      if (sighting.altitude) sighting.altitude = `${sighting.altitude} m`;
      sightings[sighting.id] = keysSnakeToCamel(sighting);
    });
    setSightings(sightings);
  } catch (error) {
    console.error(`Error while loading sightings: ${error.message}`);
  }

  try {
    const response = await fetch('http://localhost:8000/events');
    if (!response.ok) {
      throw new Error(`Response status ${response.status}`);
    }

    const events = {};
    const eventsList = await response.json();
    eventsList.map((event) => {
      event.id = event._id.$oid;
      delete event._id;
      event.time_event = new Date(event.time * 1000).toLocaleDateString('en-EN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      event.distance_nominal = `${event.distance_nominal} AU`;
      if (event.distance_minimum) event.distance_minimum = `${event.distance_minimum} AU`;
      event.velocity_relative = `${event.velocity_relative} kps`;
      if (event.velocity_infinity)
        event.velocity_infinity = `${event.velocity_infinity} kps`;
      event.diameter = [`${event.diameter[0]} m`, `${event.diameter[1]} m`];
      events[event.id] = keysSnakeToCamel(event);
    });
    setEvents(events);
  } catch (error) {
    console.error(`Error while loading events: ${error.message}`);
  }
}
