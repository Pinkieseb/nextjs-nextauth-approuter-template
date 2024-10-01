'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Box, Heading, Text, VStack, Container, Flex, useColorModeValue } from '@chakra-ui/react'
import { SignInForm } from '@/components/auth/SignInForm'
import RegisterForm from '@/components/auth/RegisterForm'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      router.push('/dashboard')
    }
  }, [status, router])

  const bgColor = useColorModeValue("papaya_whip.50", "gray.800")
  const headingColor = useColorModeValue("prussian_blue.600", "prussian_blue.200")
  const textColor = useColorModeValue("air_superiority_blue.600", "air_superiority_blue.200")

  if (status === "loading") {
    return <Text>Loading...</Text>
  }

  return (
    <Box minHeight="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
      <Container>
        <Flex direction="column" align="center" justify="center" width="full">
          <VStack spacing={8} align="center" flex={1}>
            <Heading as="h1" size="3xl" color={headingColor} textAlign="center">
              Welcome to the Auth App
            </Heading>
            <Text fontSize="xl" color={textColor} textAlign="center">
              Experience advanced authentication in Next.js
            </Text>
            <AnimatePresence mode="wait">
              {showRegister ? (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                >
                  <RegisterForm onSwitch={() => setShowRegister(false)} />
                </motion.div>
              ) : (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                >
                  <SignInForm onSwitch={() => setShowRegister(true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </VStack>
        </Flex>
      </Container>
    </Box>
  )
}
