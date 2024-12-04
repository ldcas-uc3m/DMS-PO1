import { Box, Text } from '@chakra-ui/react';

const ObjectListItem = ({ item, ...otherProps }) => {
  return (
    <Box bg="black" rounded="lg" p="2" {...otherProps}>
      <Text fontWeight="bold">{item.summary}</Text>
      <Text fontWeight="light">
        {item.timeEvent}, {item.locationAprox}
      </Text>
      <Text fontSize="sm" fontStyle="italic">
        {item.source}
      </Text>
    </Box>
  );
};

export default ObjectListItem;
