import { Flex, Text } from '@chakra-ui/react';

const ObjectDetails = ({ ...otherProps }) => {
  return (
    <Flex bg="bg.emphasized" rounded="xl" align="center" justify="center" {...otherProps}>
      <Text textStyle="xl" fontWeight="bold" textAlign="center">
        Detailed information about currently selected item
      </Text>
    </Flex>
  );
};

export default ObjectDetails;
