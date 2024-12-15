import { Box, Flex, Heading, Spinner, Text, Button } from '@chakra-ui/react';
import ObjectListItem from './ObjectListItem';
import { useEffect, useState } from 'react';

const ObjectList = ({
  sightings,
  setSightings,
  events,
  currentElement,
  setCurrentElement,
  currentPosition,
  ...otherProps
}) => {
  const [sightingsKeys, setSightingsKeys] = useState(null);
  const [eventsKeys, setEventsKeys] = useState(null);

  useEffect(() => {
    setSightingsKeys(null);
    if (sightings) {
      let keys = Object.keys(sightings).sort(
        (a, b) =>
          sightings[a].locationPrecise &&
          sightings[a].locationPrecise.length == 2 &&
          sightings[b].locationPrecise &&
          sightings[b].locationPrecise.length == 2 // are precise locations available?
            ? distance(sightings[a].locationPrecise, currentPosition) -
              distance(sightings[b].locationPrecise, currentPosition)
            : 23401, // result of distance([0.0, 90.0], [0.0, -90.0]), which is north and south pole and thus the biggest possible value)
      );
      setSightingsKeys(keys);
    }
  }, [sightings, currentPosition]);

  useEffect(() => {
    setEventsKeys(null);
    if (events) {
      setEventsKeys(Object.keys(events));
    }
  }, [events]);

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

  const handleRefresh = async () => {
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
  };

  return (
    <Flex
      direction="column"
      bg="bg.emphasized"
      rounded="xl"
      padding="2"
      gap="2"
      {...otherProps}
    >
      <Flex direction="column" flex="1 1 0" gap="2">
        <Heading alignSelf="center">Sightings</Heading>
        <Button colorScheme="blue" size="sm" onClick={handleRefresh}>
          Refresh
        </Button>
        {!sightingsKeys ? (
          <Flex flex="1 1 0" justify="center" align="center">
            <Spinner />
          </Flex>
        ) : sightingsKeys.length == 0 ? (
          <Flex w="100%" h="100%" align="center" justify="center">
            <Text fontStyle="italic">No sightings available</Text>
          </Flex>
        ) : (
          <Box overflowY="auto" flex="1 1 0">
            <ListItems
              items={sightings}
              keys={sightingsKeys}
              currentElement={currentElement}
              setCurrentElement={setCurrentElement}
            />
          </Box>
        )}
      </Flex>
      <Flex direction="column" flex="1 1 0" gap="2">
        <Heading alignSelf="center">Astronomical Events</Heading>
        {!eventsKeys ? (
          <Flex flex="1 1 0" justify="center" align="center">
            <Spinner />
          </Flex>
        ) : eventsKeys.length == 0 ? (
          <Flex w="100%" h="100%" align="center" justify="center">
            <Text fontStyle="italic">No events available</Text>
          </Flex>
        ) : (
          <Box overflowY="auto" flex="1 1 0">
            <ListItems
              items={events}
              keys={eventsKeys}
              currentElement={currentElement}
              setCurrentElement={setCurrentElement}
            />
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

const ListItems = ({ items, keys, currentElement, setCurrentElement }) => {
  return (
    <>
      {keys.map((key, index) => {
        const item = items[key];
        return (
          <ObjectListItem
            item={item}
            isCurrentElement={currentElement && currentElement.id === item.id}
            mb={index < keys.length - 1 ? '2' : null}
            onClick={() => setCurrentElement({ ...item })} // reconstructing object to enforce triggering useEffects even on the same element
            cursor="pointer"
            key={item.id}
          />
        );
      })}
    </>
  );
};

function distance(a, b) {
  // adapted from https://www.movable-type.co.uk/scripts/latlong.html
  const x = (b[0] - a[0]) * Math.cos((a[1] + b[1]) / 2);
  const y = b[1] - a[1];
  return Math.sqrt(x * x + y * y);
}

export default ObjectList;
