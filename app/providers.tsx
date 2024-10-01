'use client'

import { SessionProvider } from 'next-auth/react'
import { ErrorBoundary } from 'react-error-boundary'
import { ReactNode, useEffect } from 'react'
import { ChakraProvider, ColorModeScript, useColorMode } from '@chakra-ui/react'
import theme from '@/lib/theme'
import useAuthStore from '@/lib/stores/authStore'
import { Toaster } from 'react-hot-toast'

function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function ColorModeManager({ children }: { children: ReactNode }) {
  const { user } = useAuthStore()
  const { setColorMode } = useColorMode()

  useEffect(() => {
    if (user) {
      setColorMode(user.darkMode ? 'dark' : 'light')
    }
  }, [user, setColorMode])

  return <>{children}</>
}

export function Providers({ children, session }: { children: ReactNode, session: any }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <SessionProvider session={session}>
          <ColorModeManager>
            {children}
            <Toaster position="bottom-right" />
          </ColorModeManager>
        </SessionProvider>
      </ChakraProvider>
    </ErrorBoundary>
  )
}
