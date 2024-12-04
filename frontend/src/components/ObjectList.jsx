import { Box, Flex, Heading } from '@chakra-ui/react';
import ObjectListItem from './ObjectListItem';

const ListItems = ({ items, setCurrentElement }) => {
  return (
    <>
      {Object.keys(items).map((key, index, keys) => (
        <ObjectListItem
          item={items[key]}
          mb={index < keys.length - 1 ? '2' : null}
          onClick={() => setCurrentElement(items[key])}
          cursor="pointer"
          key={index} // TODO should be replaced by a proper element-specific id
        />
      ))}
    </>
  );
};

const ObjectList = ({ sightings, events, setCurrentElement, ...otherProps }) => {
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
        <Box overflowY="auto" flex="1 1 0">
          <ListItems items={sightings} setCurrentElement={setCurrentElement} />
        </Box>
      </Flex>
      <Flex direction="column" flex="1 1 0" gap="2">
        <Heading alignSelf="center">Astronomical Events</Heading>
        <Box overflowY="auto" flex="1 1 0">
          <ListItems items={events} setCurrentElement={setCurrentElement} />
        </Box>
      </Flex>
    </Flex>
  );
};

export default ObjectList;
