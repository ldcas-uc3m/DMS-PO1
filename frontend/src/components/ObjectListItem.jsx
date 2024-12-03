import { Box, Text } from '@chakra-ui/react';

const ObjectListItem = ({ item, ...otherProps }) => {
  if (!item) {
    return <></>;
  }
  return (
    <Box direction="column" bg="black" rounded="lg" p="2" {...otherProps}>
      <Text fontWeight="bold">{item.summary}</Text>
      <Text fontWeight="light">
        {item.time_event}, {item.location_aprox}
      </Text>
      <Text fontSize="sm" fontStyle="italic">
        {item.source}
      </Text>
    </Box>
  );
};

export default ObjectListItem;
