import { Flex, Text } from '@chakra-ui/react';

const Map = ({ ...otherProps }) => {
  return (
    <Flex backgroundColor="black" align="center" justify="center" {...otherProps}>
      <Text textStyle="4xl" fontWeight="bold">
        Map with locations marked
      </Text>
    </Flex>
  );
};

export default Map;
