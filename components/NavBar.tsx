'use client'

import NextLink from "next/link"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Box, Flex, Button, Menu, MenuButton, MenuList, MenuItem, useColorMode } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import useAuthStore from '@/lib/stores/authStore'
import { toggleDarkMode } from '@/app/auth/actions'

export default function NavBar() {
  const { data: session } = useSession()
  const router = useRouter()
  const { colorMode, toggleColorMode } = useColorMode()
  const { user, logout, setDarkMode } = useAuthStore()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    logout()
    router.push('/')
  }

  const handleToggleDarkMode = async () => {
    toggleColorMode()
    if (session?.user?.id) {
      const newDarkMode = await toggleDarkMode(session.user.id)
      setDarkMode(newDarkMode)
    }
  }

  return (
    <Box as="nav" bg={colorMode === 'dark' ? "gray.800" : "white"} py={4}>
      <Flex maxW="container.xl" mx="auto" justify="space-between" align="center" px={4}>
        <Button as={NextLink} href="/" variant="ghost">
          Home
        </Button>
        <Flex>
          {session ? (
            <>
              <Button as={NextLink} href="/dashboard" variant="ghost" mr={2}>
                Dashboard
              </Button>
              <Menu>
                <MenuButton as={Button} variant="ghost">
                  {session.user.name || session.user.email}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={handleToggleDarkMode}>
                    {colorMode === 'light' ? <MoonIcon mr={2} /> : <SunIcon mr={2} />}
                    Toggle {colorMode === 'light' ? 'Dark' : 'Light'} Mode
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Button as={NextLink} href="/auth/signin" variant="ghost" mr={2}>
                Sign in
              </Button>
              <Button onClick={handleToggleDarkMode} variant="ghost">
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}
