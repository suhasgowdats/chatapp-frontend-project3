import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import SideDrawer from '../components/misclenium/SideDrawer';
import {Box} from "@chakra-ui/layout"
import Mychats from '../components/misclenium/Mychats';
import ChatBox from '../components/misclenium/ChatBox';

function ChatPage() {
    const {user}=ChatState();
    const [fetchAgain, setFetchAgain]=useState(false)
    

  return (
    <div style={{width:'100%'}}>
            {user && <SideDrawer/>}   
            <Box
            d='flex'
            justifyContent='space-between' 
            w='100%'
            h='91.5vh'
            p='10px'
            >
                {user && <Mychats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
    </div>
  )
}

export default ChatPage