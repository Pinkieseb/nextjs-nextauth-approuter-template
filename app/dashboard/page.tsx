'use client'

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Box, Heading, Text, VStack, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, useColorModeValue } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getUserData } from '../auth/actions'

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  darkMode: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin')
    },
  })

  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserData() {
      if (session?.user?.id) {
        try {
          const userData = await getUserData(session.user.id)
          setUser(userData)
        } catch (err) {
          setError('Failed to fetch user data')
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUserData()
  }, [session])

  if (status === "loading" || loading) {
    return <Text>Loading...</Text>
  }

  if (error) {
    return <Text color="barn_red.500">{error}</Text>
  }

  if (!user) {
    return <Text color="barn_red.500">User not found</Text>
  }

  const headingColor = useColorModeValue("prussian_blue.600", "prussian_blue.200")
  const labelColor = useColorModeValue("air_superiority_blue.600", "air_superiority_blue.200")
  const valueColor = useColorModeValue("prussian_blue.700", "prussian_blue.100")

  return (
    <VStack align="stretch" spacing={8}>
      <Heading color={headingColor} fontSize="2xl">User Information</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <Stat>
          <StatLabel color={labelColor}>Name</StatLabel>
          <StatNumber color={valueColor}>{user.name || 'N/A'}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel color={labelColor}>Email</StatLabel>
          <StatNumber color={valueColor}>{user.email}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel color={labelColor}>Role</StatLabel>
          <StatNumber color={valueColor}>{user.role}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel color={labelColor}>Joined</StatLabel>
          <StatNumber color={valueColor}>{new Date(user.createdAt).toLocaleDateString()}</StatNumber>
          <StatHelpText>{new Date(user.createdAt).toLocaleTimeString()}</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel color={labelColor}>Dark Mode</StatLabel>
          <StatNumber color={valueColor}>{user.darkMode ? 'Enabled' : 'Disabled'}</StatNumber>
        </Stat>
      </SimpleGrid>
    </VStack>
  )
}
