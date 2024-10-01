import { ThemeConfig, extendTheme } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const colors = {
  prussian_blue: {
    50: '#e6f0f5',
    100: '#cce1eb',
    200: '#99c3d7',
    300: '#66a5c3',
    400: '#3387af',
    500: '#00699b',
    600: '#004f7c',
    700: '#00375d',
    800: '#001f3e',
    900: '#00071f',
  },
  air_superiority_blue: {
    50: '#f0f5fa',
    100: '#e1ebf5',
    200: '#c3d7eb',
    300: '#a5c3e1',
    400: '#87afd7',
    500: '#669bcd',
    600: '#4f7ca3',
    700: '#375d7a',
    800: '#1f3e51',
    900: '#071f28',
  },
  barn_red: {
    50: '#fae6e6',
    100: '#f5cccc',
    200: '#eb9999',
    300: '#e16666',
    400: '#d73333',
    500: '#cd0000',
    600: '#a30000',
    700: '#7a0000',
    800: '#510000',
    900: '#280000',
  },
  papaya_whip: {
    50: '#fffdf9',
    100: '#fffbf3',
    200: '#fff7e7',
    300: '#fff3db',
    400: '#ffefcf',
    500: '#fdebc3',
    600: '#cabb9c',
    700: '#988c75',
    800: '#655d4e',
    900: '#332f27',
  },
}

const fonts = {
  body: 'Inter, sans-serif',
  heading: 'Playfair Display, serif',
}

const styles = {
  global: (props: { colorMode: 'light' | 'dark' }) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    },
  }),
}

const components = {
  Button: {
    baseStyle: (props: { colorMode: 'light' | 'dark' }) => ({
      _hover: {
        bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.100',
      },
    }),
    variants: {
      ghost: (props: { colorMode: 'light' | 'dark' }) => ({
        color: props.colorMode === 'dark' ? 'white' : 'inherit',
        _hover: {
          bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.100',
        },
      }),
    },
  },
  Link: {
    baseStyle: (props: { colorMode: 'light' | 'dark' }) => ({
      color: props.colorMode === 'dark' ? 'blue.300' : 'blue.600',
    }),
  },
  Heading: {
    baseStyle: (props: { colorMode: 'light' | 'dark' }) => ({
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    }),
  },
  Text: {
    baseStyle: (props: { colorMode: 'light' | 'dark' }) => ({
      color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
    }),
  },
  Container: {
    baseStyle: {
      maxW: 'container.md',
      centerContent: true,
      px: 4,
    },
  },
  Input: {
    baseStyle: (props: { colorMode: 'light' | 'dark' }) => ({
      field: {
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        _placeholder: {
          color: props.colorMode === 'dark' ? 'gray.400' : 'gray.500',
        },
      },
    }),
  },
}

const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
})

export default theme
