import type { AppProps } from 'next/app'
import { Layout } from 'components/Layout'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

const theme = createTheme({
  palette: {
    mode: 'light'
  }
})

const App = ({ Component, pageProps }: AppProps<{ session: Session }>) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </ThemeProvider>
  )
}

export default App
