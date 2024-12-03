import { Flex, Text } from '@chakra-ui/react';

const ObjectDetails = ({ element, ...otherProps }) => {
  return (
    <Flex bg="bg.emphasized" rounded="xl" align="center" justify="center" {...otherProps}>
      {!element && <Text fontStyle="italic">No element selected</Text>}
      {element && <Text>{element.summary}</Text>}
    </Flex>
  );
};

export default ObjectDetails;
