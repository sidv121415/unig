import * as React from 'react'

import theme from './components/theme'
import { ChakraProvider, ColorModeProvider, ColorModeScript } from '@chakra-ui/react'
import { AuthProvider } from './context/AuthContext'
import * as ReactDOM from 'react-dom/client'
import App from './App'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} ></ColorModeScript>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>,
)


