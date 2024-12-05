import { Flex, Box, Text, Heading } from '@chakra-ui/react';

const ObjectDetails = ({ element, ...otherProps }) => {
  let summary, description, otherKeys;
  if (element) {
    ({ summary, description, ...otherKeys } = element); //summary isn't used later on purpose
  }

  return (
    <Box bg="bg.emphasized" rounded="xl" padding="2" overflowY="auto" {...otherProps}>
      {!element && (
        <Flex w="100%" h="100%" align="center" justify="center">
          <Text fontStyle="italic">No element selected</Text>
        </Flex>
      )}
      {element && (
        <>
          <Heading>Here we could use a title</Heading>
          <Text>{description}</Text>
          <Heading>Other information</Heading>
          <Box>
            {Object.keys(otherKeys)
              .sort()
              .map((key) => (
                <Text key={key}>
                  <b>{key}: </b>
                  {otherKeys[key]}
                </Text>
              ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ObjectDetails;
