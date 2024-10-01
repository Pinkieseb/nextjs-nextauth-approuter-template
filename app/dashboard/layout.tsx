'use client'

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import logger from "@/lib/logger"
import { Box, Container, Flex, Heading, Text, VStack, Avatar, useColorModeValue } from '@chakra-ui/react'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin')
    },
  })

  const bgColor = useColorModeValue("papaya_whip.50", "gray.800")
  const headingColor = useColorModeValue("prussian_blue.600", "prussian_blue.200")
  const textColor = useColorModeValue("air_superiority_blue.600", "air_superiority_blue.200")

  if (status === "loading") {
    return <div>Loading...</div>
  }

  logger.info(`Rendering dashboard layout for user: ${session.user.email}`)

  return (
    <Box minHeight="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        <VStack align="stretch" spacing={8}>
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Heading color={headingColor} fontSize="3xl">Dashboard</Heading>
              <Text color={textColor}>Welcome back, {session.user.name || session.user.email}!</Text>
            </VStack>
            <Avatar name={session.user.name || session.user.email} src={session.user.image || undefined} size="lg" />
          </Flex>
          <Box bg={useColorModeValue("white", "gray.700")} p={6} borderRadius="lg" boxShadow="md">
            {children}
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
