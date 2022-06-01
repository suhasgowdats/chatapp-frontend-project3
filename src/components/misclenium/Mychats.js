import { AddIcon } from '@chakra-ui/icons';
import { Box, Button,Text, Stack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getSender } from '../../configs/ChatLogics';
import { ChatState } from '../../context/ChatProvider'
import ChatLoading from '../ChatLoading';
import GroupChatModel from './GroupChatModel';

function Mychats({fetchAgain}) {
  const [loggedUser, setLoggedUser]=useState([]);
  const {selectedChat, setSelectedChat, user,chats, setChats}=ChatState();

  const toast=useToast();
  
  const fetchChats = async () =>{
    try{
      const obj={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }

      const {data} = await axios.get('https://chatapp-demouse-2022.herokuapp.com/api/chats',obj)
      setChats(data);

    }catch(error){
      toast({
        title:'Error occured',
        description:"Failed to load the chats",
        status:"error",
        isClosable:true,
        duration:3000,
        position:'bottom-left'
    })
    }
  }

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  },[fetchAgain])

  return (
    <Box d={{base:selectedChat?'none':"flex", md:'flex'}}
     flexDir='column'
     alignItems='center'
     p={3}
     bg='white'
     w={{base:'100%', md:'31%'}} 
     borderRadius='lg'
     borderWidth='1px' >
       <Box
       pb={3}
       px={3}
       fontSize={{base:'28px',  md:'30px'}}
       fontFamily='Work sans'
       d='flex'
       w='100%'
       justifyContent='space-between'
       alignItems='center' >
         My chats
         <GroupChatModel>
         <Button d='flex'
         fontSize={{base:'15px',md:'10px', lg:'15px'}}
         rightIcon={<AddIcon/>} >New Group Chat</Button>   
         </GroupChatModel>      
       </Box>       
       <Box d='flex'
       flexDir='column'
       p={3}
       bg='#F8F8F8'
       w='100%'
       h='100%'
       borderRadius='lg'
       overflow='hidden' >
         {chats?(<Stack overflowY='scroll'>
           {chats.map((chat)=>(
             <Box
              onClick={()=>setSelectedChat(chat)}
              cursor='pointer'
              bg={selectedChat===chat?"#38B2Ac":"#E8E8E8"}
              color={selectedChat===chat?"white":"black"}
              px={3}
              py={2}
              borderRadius='lg'
              key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat?
                  getSender(loggedUser,chat.users):chat.chatName}
                </Text>
              </Box>
           ))}
         </Stack>):(<ChatLoading/>)}
       </Box>

    </Box>
  )
}

export default Mychats