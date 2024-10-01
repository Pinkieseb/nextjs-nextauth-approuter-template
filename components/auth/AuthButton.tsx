'use client'

import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useEffect } from 'react'
import useAuthStore from '@/lib/stores/authStore'
import { Button, Text, HStack, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { toast } from 'react-hot-toast'
import { useAutoAnimate } from '@formkit/auto-animate/react'

const AuthButton = () => {
  const { data: session, status } = useSession()
  const { user, setUser, logout } = useAuthStore()
  const router = useRouter()
  const [animationParent] = useAutoAnimate()

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        darkMode: false // or any default value for darkMode
      })
    } else if (status === 'unauthenticated') {
      logout()
    }
  }, [session, status, setUser, logout])

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    logout()
    router.push("/")
    toast.success('Signed out successfully!')
  }

  if (status === 'loading') {
    return <Text color="air_superiority_blue.500">Loading...</Text>
  }

  if (user) {
    return (
      <Menu>
        <MenuButton as={Button} variant="ghost" colorScheme="blue">
          {user.name || user.email}
        </MenuButton>
        <MenuList ref={animationParent}>
          <MenuItem onClick={() => router.push('/dashboard')}>Dashboard</MenuItem>
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </MenuList>
      </Menu>
    )
  }
  
  return (
    <HStack spacing={4} ref={animationParent}>
      <Button as={NextLink} href="/auth/signin" colorScheme="blue" variant="ghost">
        Sign In
      </Button>
      <Button as={NextLink} href="/auth/register" colorScheme="blue">
        Register
      </Button>
    </HStack>
  )
}

export default AuthButton
