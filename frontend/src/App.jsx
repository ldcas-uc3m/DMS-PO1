import { useState } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import Map from './components/Map';
import ObjectList from './components/ObjectList';
import ObjectDetails from './components/ObjectDetails';

function App() {
  const [showElements, setShowElements] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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
        {showElements && <ObjectList w="40%" />}
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
