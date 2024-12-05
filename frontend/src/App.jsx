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
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  await delay(5000);
  // TODO load data from database and already make transformations into readable data where necessary.

  const sightings = {
    sighting1: {
      id: 'sighting1',
      source: 'source',
      timeEvent: '03.12.2024 16:12',
      timePost: '03.12.2024 16:25',
      locationAprox: 'Madrid',
      locationPrecise: [-3.70329, 40.416728],
      distance: '1 m',
      altitude: '1 m',
      shape: 'shape',
      size: 'size',
      features: 'features',
      summary: 'This is the summary of sighting 1.',
      description:
        'This on the other hand is a whole description of everything that happened. A lot of little details mentioned here and there and overall just quite a bit more text.',
      explanation: 'explanation',
      numObservers: 'num_observers',
      media: ['www.google.de', 'www.uc3m.es'],
    },
    sighting2: {
      id: 'sighting2',
      source: 'source',
      timeEvent: '03.12.2024 16:12',
      timePost: '03.12.2024 16:25',
      locationAprox: 'Leganés',
      locationPrecise: [-3.768654, 40.331951],
      distance: '1 m',
      altitude: '1 m',
      shape: 'shape',
      size: 'size',
      features: 'features',
      summary: 'This is the summary of sighting 2.',
      description:
        'This on the other hand is a whole description of everything that happened. A lot of little details mentioned here and there and overall just quite a bit more text.',
      explanation: 'explanation',
      numObservers: 'num_observers',
      media: ['www.google.de', 'www.uc3m.es'],
    },
    sighting3: {
      id: 'sighting3',
      source: 'source',
      timeEvent: '03.12.2024 16:12',
      timePost: '03.12.2024 16:25',
      locationAprox: 'Getafe',
      locationPrecise: [-3.732393, 40.30825],
      distance: '1 m',
      altitude: '1 m',
      shape: 'shape',
      size: 'size',
      features: 'features',
      summary: 'This is the summary of I think we need titles.',
      description:
        'This on the other hand is a whole description of everything that happened. A lot of little details mentioned here and there and overall just quite a bit more text.',
      explanation: 'explanation',
      numObservers: 'num_observers',
      media: ['www.google.de', 'www.uc3m.es'],
    },
  };

  const events = {
    event1: {
      id: 'event1',
      summary: 'The summary field is not defined officially for events...',
      description: 'Neither is the description field officially devined for events!',
      source: 'source',
      timeEvent: '03.12.2024 16:11', // deviated from currently defined format here! Currently just called time
      distanceNominal: '1 AU',
      distanceMinimum: '1 AU',
      velocityRelative: '1 kps',
      velocityInfinity: '1 kps',
      magnitude: '1',
      diameter: ['1 m', '2 m'],
      rarity: 0,
    },
  };

  setSightings(sightings);
  setEvents(events);
}
