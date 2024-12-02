import { Flex, Text } from '@chakra-ui/react';

const ObjectListItem = ({ ...otherProps }) => {
  return (
    <Flex bg="black" rounded="lg" h="32" align="center" justify="center" {...otherProps}>
      <Text textStyle="xl" fontWeight="bold">
        Item quick info
      </Text>
    </Flex>
  );
};

export default ObjectListItem;
