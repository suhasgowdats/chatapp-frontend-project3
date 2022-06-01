import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton,Input,Spinner,  Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getSender, getSenderFull } from '../configs/ChatLogics';
import { ChatState } from '../context/ChatProvider'
import ScrollableChat from '../ScrollableChat';
import ProfileModel from './misclenium/ProfileModel';
import UpdateGroupChatModel from './misclenium/UpdateGroupChatModel';
import './style.css';
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from "../animation/typing.json"

const ENDPOINT='https://chatapp-demouse-2022.herokuapp.com'
var socket, selectedChatCompair;

function SingleChat({fetchAgain, setFetchAgain}) {
    const [messages, setMessages]=useState([])
    const [loading, setLoading]=useState(false)
    const [newMessage, setNewMessage]=useState()
    const [socketConnected, setSocketConnected]=useState(false)
    const [typing, setTyping]=useState(false)
    const [isTyping, setIsTyping]=useState(false)

    const defaultOptions={
        loop:true,
        autoplay:true,
        animationData:animationData,
        rendererSettings:{
            preserveAspectRatio:'xMidYMid slice'
        }
    }

    const {user, selectedChat, setSelectedChat,notification, setNotification}=ChatState();

    const toast=useToast()


    const fetchMessages=async()=>{
        if(!selectedChat) return;

        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            setLoading(true)

            const {data}=await axios.get(`https://chatapp-demouse-2022.herokuapp.com/api/message/${selectedChat._id}`,config)
            console.log(messages)

            setMessages(data)
            setLoading(false)
            socket.emit('join chat', selectedChat._id)

        } catch (error) {
            toast({
                title:'Error occured',
                description:"Failed to load the message",
                status:"error",
                isClosable:true,
                duration:3000,
                position:'bottom'
            });
            return;             
        }
    }


    const sendMessage=async(event)=>{
        if(event.key==="Enter" && newMessage){
            socket.emit('stop typing',selectedChat._id)
            try{
                const config={
                    headers:{
                        'Content-type':'application/json',
                        Authorization:`Bearer ${user.token}`
                    }
                }

                setNewMessage('')

                const {data}=await axios.post('https://chatapp-demouse-2022.herokuapp.com/api/message',{
                    content:newMessage,
                    chatId:selectedChat
                },
                config
                )
                socket.emit('new message', data)

                setMessages([...messages, data])

            }catch(error){
                toast({
                    title: "Error Occured!",
                    description: 'Failed to send the message',
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
            }
        }
    }

    useEffect(()=>{
        socket=io(ENDPOINT)
        socket.emit('setup',user);
        socket.on('connected' ,()=>setSocketConnected(true))
        socket.on('typing',()=>setIsTyping(true));
        socket.on('stop typing',()=>setIsTyping(false))
    },[])

    useEffect(()=>{
        fetchMessages()

        selectedChatCompair=selectedChat;
    },[selectedChat])

    useEffect(()=>{
        socket.on('message recived', (newMessageRecieved)=>{
            if(!selectedChatCompair || selectedChatCompair._id !==newMessageRecieved.chat._id ){
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved,...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }else{
                setMessages([...messages,newMessageRecieved])
            }
        })
    })

 

    const typingHandler=(e)=>{
        setNewMessage(e.target.value)
        //Typing Indicator Logic
        if(!socketConnected)return;

        if(!typing){
            setTyping(true);
            socket.emit('typing', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
    };

  return (
    <>
    {
        selectedChat?(<>
        <Text fontSize={{base:'28px', md:'30px'}}
        pb={3}
        px={2}
        w='100%'
        fontFamily='Work sans'
        d='flex'
        justifyContent={{base:"space-between"}}
        alignItems='center'>
            <IconButton d={{base:'flex', md:'none'}}
             icon={<ArrowBackIcon/>}
             onClick={()=>setSelectedChat('')}  />
             {!selectedChat.isGroupChat ?(
                 <>{getSender(user,selectedChat.users)}
                 <ProfileModel user={getSenderFull(user, selectedChat.users)} /></>
             ):(
                 <>
                 {selectedChat.chatName.toUpperCase()}
                 <UpdateGroupChatModel
                 fetchAgain={fetchAgain}
                 setFetchAgain={setFetchAgain}
                 fetchMessages={fetchMessages}
                 />
                 </>
             )}
            </Text>
            <Box d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden">
                {loading?(
                    <Spinner size='xl' 
                    w={20}
                    h={20}
                    alignSelf='center'
                    margin='auto'/>
                ):(
                    <div className='messages'>
                        <ScrollableChat messages={messages} />
                    </div>
                )}
                <FormControl onKeyDown={sendMessage}>
                    {isTyping?<div>
                        <Lottie
                        options={defaultOptions}
                        width={70}
                        style={{marginBottom:15, marginLeft:0}} 
                        />
                    </div>:<></>}
                    <Input variant='filled'
                    bg='#E0E0E0'
                    placeholder='Enter a message'
                    onChange={typingHandler}
                    value={newMessage} />
                </FormControl>
                </Box>        
        </>):
        (<Box d='flex' alignItems='center' justifyContent='center' h='100%' w='100%' >
        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
          Click on a user to start chatting
        </Text>
      </Box>)
    }
    </>
  )
}

export default SingleChat