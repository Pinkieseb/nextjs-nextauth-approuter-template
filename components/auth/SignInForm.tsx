'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import logger from "@/lib/logger"
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, InputGroup, InputRightElement, IconButton, useDisclosure, Heading, useColorModeValue } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import toast from 'react-hot-toast'

interface SignInFormProps {
  onSwitch: () => void
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSwitch }) => {
  const { isOpen, onToggle } = useDisclosure()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [animationParent] = useAutoAnimate()

  const bgColor = useColorModeValue("white", "gray.700")
  const textColor = useColorModeValue("gray.800", "white")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const placeholderColor = useColorModeValue("gray.400", "gray.500")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    logger.info('Attempting sign in', { component: 'SignInForm', email })
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      logger.error('Sign in failed', { component: 'SignInForm', error: result.error })
      toast.error('Sign in failed. Please check your credentials and try again.')
    } else {
      logger.info('Sign in successful', { component: 'SignInForm', email })
      toast.success('Sign in successful!')
      router.push("/dashboard")
    }
    setIsLoading(false)
  }

  return (
    <Box as="form" onSubmit={handleSubmit} w="full" maxW="md">
      <VStack spacing={6} align="stretch" bg={bgColor} p={8} borderRadius="xl" boxShadow="xl" ref={animationParent}>
        <Heading as="h1" size="xl" color={useColorModeValue("prussian_blue.600", "prussian_blue.200")} textAlign="center">Welcome Back</Heading>
        <FormControl isRequired>
          <FormLabel color={useColorModeValue("air_superiority_blue.700", "air_superiority_blue.200")}>Email</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="your.email@example.com"
            borderColor={borderColor}
            _hover={{ borderColor: useColorModeValue("gray.300", "gray.500") }}
            _focus={{ borderColor: "air_superiority_blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-air_superiority_blue-500)" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            color={textColor}
            _placeholder={{ color: placeholderColor }}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel color={useColorModeValue("air_superiority_blue.700", "air_superiority_blue.200")}>Password</FormLabel>
          <InputGroup>
            <Input
              type={isOpen ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              borderColor={borderColor}
              _hover={{ borderColor: useColorModeValue("gray.300", "gray.500") }}
              _focus={{ borderColor: "air_superiority_blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-air_superiority_blue-500)" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              color={textColor}
              _placeholder={{ color: placeholderColor }}
            />
            <InputRightElement>
              <IconButton
                aria-label={isOpen ? "Hide password" : "Show password"}
                icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
                onClick={onToggle}
                variant="ghost"
                color="air_superiority_blue.500"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button 
          type="submit" 
          colorScheme="blue" 
          size="lg" 
          fontSize="md"
          isLoading={isLoading}
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          transition="all 0.2s"
        >
          Sign In
        </Button>
        <Text color={useColorModeValue("air_superiority_blue.600", "air_superiority_blue.200")} textAlign="center">
          Don't have an account? <Button variant="link" onClick={onSwitch} color={useColorModeValue("prussian_blue.600", "prussian_blue.200")} fontWeight="semibold">Register</Button>
        </Text>
      </VStack>
    </Box>
  )
}
