import { Header } from 'components/Header'
import React, { ReactNode } from 'react'
import { Container } from '@mui/material'

type Props = {
  children: ReactNode
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <Container maxWidth="md">
        <main>{children}</main>
      </Container>
    </>
  )
}
