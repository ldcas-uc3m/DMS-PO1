import { Box, Text } from '@chakra-ui/react';

const ObjectListItem = ({ item, isCurrentElement, ...otherProps }) => {
  return (
    <Box bg={isCurrentElement ? 'gray.900' : 'black'} rounded="lg" p="2" {...otherProps}>
      <Text fontWeight="bold">
        {item.locationAprox ? item.locationAprox + ' - ' : ''}
        {item.timeEvent}
      </Text>
      <Text fontWeight="light" truncate>
        {item.summary}
      </Text>
    </Box>
  );
};

export default ObjectListItem;
