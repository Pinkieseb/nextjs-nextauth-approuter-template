'use client'

import React, { ErrorInfo, ReactNode } from 'react'
import logger from '@/lib/logger'
import { Text } from '@chakra-ui/react'
import { toast } from 'react-hot-toast'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error:', { 
      component: 'ErrorBoundary',
      error, 
      errorInfo 
    })
    toast.error(`An error occurred: ${error.message}`)
  }

  render() {
    if (this.state.hasError) {
      logger.warn('Rendering error fallback UI', { component: 'ErrorBoundary' })
      return <Text color="barn_red.500">Something went wrong.</Text>
    }

    return this.props.children
  }
}

export default ErrorBoundary
