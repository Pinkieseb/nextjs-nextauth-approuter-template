import { Box, Container, Spinner, Text, VStack } from '@chakra-ui/react'

export default function DashboardLoading() {
    return (
        <Box minHeight="100vh" bg="papaya_whip.50" display="flex" alignItems="center" justifyContent="center">
            <Container centerContent>
                <VStack spacing={4}>
                    <Spinner size="xl" color="air_superiority_blue.500" thickness="4px" speed="0.65s" />
                    <Text color="air_superiority_blue.600" fontSize="lg" fontWeight="medium">Loading dashboard...</Text>
                </VStack>
            </Container>
        </Box>
    )
}
