import React, { useEffect } from 'react'
import { Box, Container, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signin from '../components/Authentication/Signin'
import {useNavigate} from 'react-router-dom'


function HomePage() {
  const nav=useNavigate()
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('userInfo'))
    if(!user){
      nav('/')
    }
  },[])
  return (
    <Container maxW='xl' centerContent>
      <Box d='flex' justifyContent='center' p='4px' bg='white' w='100%' m='15px 0 7px 0'
        borderRadius='lg' borderWidth='1px' >
        <Text fontSize='3xl' fontFamily='Work sans' color='black'>Talk-A-Tive</Text>
      </Box>
      <Box p='4px' bg='white' w='100%' m='15px 0 7px 0'
        borderRadius='lg' color='black' borderWidth='1px' >
        <Tabs variant='soft-rounded' >
          <TabList mb='1em' >
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Signin</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signin/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage