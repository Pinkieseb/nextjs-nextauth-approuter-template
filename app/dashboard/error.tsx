'use client'

import { Box, Button, Container, Heading, Text, VStack, Alert, AlertIcon } from '@chakra-ui/react'
import { toast } from 'react-hot-toast'
import { useAutoAnimate } from '@formkit/auto-animate/react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const [animationParent] = useAutoAnimate()

  toast.error(`Dashboard error: ${error.message}`)

  return (
    <Box minHeight="100vh" bg="papaya_whip.50" py={20}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch" ref={animationParent}>
          <Heading as="h1" size="2xl" color="barn_red.600" textAlign="center">Oops! Something went wrong</Heading>
          <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px" bg="barn_red.50" borderRadius="md">
            <AlertIcon boxSize="40px" mr={0} color="barn_red.500" />
            <Text mt={4} mb={1} fontSize="lg" color="barn_red.700">
              {error.message || 'An unexpected error occurred'}
            </Text>
          </Alert>
          <Button onClick={() => reset()} colorScheme="blue" size="lg" width="full">
            Try again
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}
