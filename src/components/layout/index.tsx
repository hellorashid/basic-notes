import React, { ReactNode } from 'react'
import { Box, Container, Flex } from '@chakra-ui/react'
import { Header } from './Header'
import { Footer } from './Footer'
import { NetworkStatus } from './NetworkStatus'

interface Props {
  children: ReactNode
}

export function Layout(props: Props) {
  return (
    <Box margin="0 auto" minH="100vh" bg="black"
      maxH="100vh"
      style={{
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: 'url(https://framerusercontent.com/images/jkfNOxN8uMfvqTwm0qwJh7Jw.jpg) center/cover no-repeat'
      }}>
      <Header />
      {/* <Flex flex={1} style={{ position: 'absolute' }} filter="auto" blur='10px'></Flex> */}
      <Flex flex={1} overflow="none" bg="rgb(12, 12, 12, 0.7)"
        backdropFilter="auto"
        backdropBlur="6px"
      >{props.children}</Flex>

      <Box position="fixed" bottom={2} right={2}>
        <NetworkStatus />
      </Box>

      {/* <Footer /> */}
    </Box>
  )
}
