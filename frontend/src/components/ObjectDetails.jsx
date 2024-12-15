import { Flex, Box, Text, Heading, Link } from '@chakra-ui/react';

const ObjectDetails = ({ element, ...otherProps }) => {
  let description,
    id,
    locationAprox,
    locationPrecise,
    numObservers,
    source,
    summary,
    timeEvent,
    otherKeys;
  if (element) {
    ({
      description,
      id,
      locationAprox,
      locationPrecise,
      numObservers,
      source,
      summary,
      timeEvent,
      ...otherKeys
    } = element);
  }

  return (
    <Box bg="bg.emphasized" rounded="xl" padding="4" overflowY="auto" {...otherProps}>
      {!element && (
        <Flex w="100%" h="100%" align="center" justify="center">
          <Text fontStyle="italic">No element selected</Text>
        </Flex>
      )}
      {element && (
        <Flex direction="column" gap="2">
          <Box>
            <Heading>
              {locationAprox ? locationAprox + ' - ' : ''}
              {timeEvent}
            </Heading>
            {numObservers >= 0 && (
              <Text fontStyle="italic">
                {numObservers} Observer{numObservers > 1 ? 's' : ''}
              </Text>
            )}
            <Text>{summary}</Text>
          </Box>
          {description && (
            <Box>
              <Heading>In-depth description</Heading>
              <Text>{description}</Text>
            </Box>
          )}
          {Object.keys(otherKeys).length > 0 && (
            <Box>
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
            </Box>
          )}
          <Box>
            <Heading>Source</Heading>
            <Link href={source} target="_blank" rel="noopener noreferrer">{source}</Link>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default ObjectDetails;
