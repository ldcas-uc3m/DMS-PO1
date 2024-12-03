import { useEffect, useState } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
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

  return (
    <Box h="100vh" position="relative">
      <Map position="absolute" top="0" left="0" width="100%" height="100%" />
      <Flex
        position="absolute"
        top="0"
        left="0"
        width="50%"
        height="100%"
        zIndex="10"
        p="4"
        gap="4"
      >
        {showElements && <ObjectList w="40%" sightings={sightings} events={events} />}
        <Button size="sm" rounded="xl" onClick={() => setShowElements((s) => !s)}>
          Show Elements
        </Button>
      </Flex>
      <Flex
        position="absolute"
        top="0"
        right="0"
        width="50%"
        height="100%"
        zIndex="10"
        p="4"
        gap="4"
        justify="flex-end"
      >
        <Button size="sm" rounded="xl" onClick={() => setShowDetails((s) => !s)}>
          Show Details
        </Button>
        {showDetails && <ObjectDetails w="40%" />}
      </Flex>
    </Box>
  );
}

export default App;

function loadElements(setSightings, setEvents) {
  // load data from database and already make transformations into readable data where necessary.

  const sightings = [
    {
      source: 'source',
      time_event: '03.12.2024 16:12',
      time_post: '03.12.2024 16:25',
      location_aprox: 'Madrid',
      location_precise: [40.416728, -3.70329],
      distance: '1 m',
      altitude: '1 m',
      shape: 'shape',
      size: 'size',
      features: 'features',
      summary: 'This is the summary of sighting 1.',
      description:
        'This on the other hand is a whole description of everything that happened. A lot of little details mentioned here and there and overall just quite a bit more text.',
      explanation: 'explanation',
      num_observers: 'num_observers',
      media: ['www.google.de', 'www.uc3m.es'],
    },
    {
      source: 'source',
      time_event: '03.12.2024 16:12',
      time_post: '03.12.2024 16:25',
      location_aprox: 'Leganés',
      location_precise: [40.331951, -3.768654],
      distance: '1 m',
      altitude: '1 m',
      shape: 'shape',
      size: 'size',
      features: 'features',
      summary: 'This is the summary of sighting 2.',
      description:
        'This on the other hand is a whole description of everything that happened. A lot of little details mentioned here and there and overall just quite a bit more text.',
      explanation: 'explanation',
      num_observers: 'num_observers',
      media: ['www.google.de', 'www.uc3m.es'],
    },
    {
      source: 'source',
      time_event: '03.12.2024 16:12',
      time_post: '03.12.2024 16:25',
      location_aprox: 'Getafe',
      location_precise: [40.30825, -3.732393],
      distance: '1 m',
      altitude: '1 m',
      shape: 'shape',
      size: 'size',
      features: 'features',
      summary: 'This is the summary of sighting 3.',
      description:
        'This on the other hand is a whole description of everything that happened. A lot of little details mentioned here and there and overall just quite a bit more text.',
      explanation: 'explanation',
      num_observers: 'num_observers',
      media: ['www.google.de', 'www.uc3m.es'],
    },
  ];

  const events = [
    {
      summary: 'The summary field is not defined officially for events...',
      source: 'source',
      time_event: '03.12.2024 16:11', //deviated from currently defined format here! Currently just called time
      distance_nominal: '1 AU',
      distance_minimum: '1 AU',
      velocity_relative: '1 kps',
      velocity_infinity: '1 kps',
      magnitude: '1',
      diameter: ['1 m', '2 m'],
      rarity: 0,
    },
  ];

  setSightings(sightings);
  setEvents(events);
}
