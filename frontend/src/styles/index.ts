import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7fe',
      100: '#c0e6fb',
      200: '#99d4f7',
      300: '#72c3f3',
      400: '#4bb2ef',
      500: '#2a9fe9',
      600: '#1387d1',
      700: '#0d6eb3',
      800: '#085594',
      900: '#053c76',
    },
  },
  fonts: {
    heading: 'var(--font-inter)',
    body: 'var(--font-inter)',
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});