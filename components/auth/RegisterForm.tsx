'use client'

import { registerUser } from '@/app/auth/actions'
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, InputGroup, InputRightElement, IconButton, useDisclosure, Heading, useColorModeValue } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface RegisterFormProps {
  onSwitch: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitch }) => {
  const { isOpen, onToggle } = useDisclosure()
  const [animationParent] = useAutoAnimate()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const bgColor = useColorModeValue("white", "gray.700")
  const textColor = useColorModeValue("gray.800", "white")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const placeholderColor = useColorModeValue("gray.400", "gray.500")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.target as HTMLFormElement)
    formData.append('role', 'USER')
    try {
      await registerUser(formData)
      toast.success('Registration successful! Please sign in.')
      router.push('/')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit} w="full" maxW="md">
      <VStack spacing={6} align="stretch" bg={bgColor} p={8} borderRadius="xl" boxShadow="xl" ref={animationParent}>
        <Heading as="h1" size="xl" color={useColorModeValue("prussian_blue.600", "prussian_blue.200")} textAlign="center">Create an Account</Heading>
        <FormControl isRequired>
          <FormLabel color={useColorModeValue("air_superiority_blue.700", "air_superiority_blue.200")}>Name</FormLabel>
          <Input
            type="text"
            name="name"
            placeholder="Your full name"
            borderColor={borderColor}
            _hover={{ borderColor: useColorModeValue("gray.300", "gray.500") }}
            _focus={{ borderColor: "air_superiority_blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-air_superiority_blue-500)" }}
            color={textColor}
            _placeholder={{ color: placeholderColor }}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel color={useColorModeValue("air_superiority_blue.700", "air_superiority_blue.200")}>Email</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="your.email@example.com"
            borderColor={borderColor}
            _hover={{ borderColor: useColorModeValue("gray.300", "gray.500") }}
            _focus={{ borderColor: "air_superiority_blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-air_superiority_blue-500)" }}
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
              placeholder="Create a strong password"
              borderColor={borderColor}
              _hover={{ borderColor: useColorModeValue("gray.300", "gray.500") }}
              _focus={{ borderColor: "air_superiority_blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-air_superiority_blue-500)" }}
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
          Register
        </Button>
        <Text color={useColorModeValue("air_superiority_blue.600", "air_superiority_blue.200")} textAlign="center">
          Already have an account? <Button variant="link" onClick={onSwitch} color={useColorModeValue("prussian_blue.600", "prussian_blue.200")} fontWeight="semibold">Sign In</Button>
        </Text>
      </VStack>
    </Box>
  )
}

export default RegisterForm
