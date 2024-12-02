import { Box, Flex, Heading, Separator } from '@chakra-ui/react';
import ObjectListItem from './ObjectListItem';

const ObjectList = ({ ...otherProps }) => {
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
          <ObjectListItem mb="2" />
          <ObjectListItem mb="2" />
          <ObjectListItem mb="2" />
          <ObjectListItem mb="2" />
          <ObjectListItem mb="2" />
          <ObjectListItem />
        </Box>
      </Flex>
      <Flex direction="column" flex="1 1 0" gap="2">
        <Heading alignSelf="center">Astronomical Events</Heading>
        <Box overflowY="auto" flex="1 1 0">
          <ObjectListItem mb="2" />
          <ObjectListItem mb="2" />
          <ObjectListItem mb="2" />
          <ObjectListItem mb="2" />
          <ObjectListItem mb="2" />
          <ObjectListItem />
        </Box>
      </Flex>
    </Flex>
  );
};

export default ObjectList;
