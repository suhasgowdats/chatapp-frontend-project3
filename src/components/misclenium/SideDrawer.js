import React, { useState } from 'react'
import { Box, Text } from '@chakra-ui/layout'
import { Button, effect, Input,  toast, Tooltip, useToast } from '@chakra-ui/react'
import { Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider, } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import {ChatState} from '../../context/ChatProvider'
import ProfileModel from './ProfileModel'
import {useNavigate} from 'react-router-dom'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
  } from '@chakra-ui/react'
  import {useDisclosure} from "@chakra-ui/hooks"
  import axios from 'axios'
import ChatLoading from '../ChatLoading'
import UserListItem from '../UserAvathar/UserListItem'
import { Spinner } from '@chakra-ui/react'
import { getSender } from '../../configs/ChatLogics'
import {Effect} from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge'


function SideDrawer() {
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading]=useState(false)
    const [loadingChat, setLoadingChat] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast=useToast()


    const Nav=useNavigate()

    const logoutHandel=()=>{
        localStorage.removeItem('userInfo')
        Nav('/')
    }
    
    // const user=JSON.parse(localStorage.getItem("userInfo"))


    const {user, setSelectedChat, chats, setChats,notification, setNotification}=ChatState()

    const handelSearch= async()=>{
        if(!search){
            toast({
                title:'Plsease enter something to search',
                status:"warning",
                isClosable:true,
                duration:3000,
                position:'top-left'
            })
            return
        }
        try{
            setLoading(true)
            const obj={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.get(`https://chatapp-demouse-2022.herokuapp.com/api/user?search=${search}`,obj)
            
            setLoading(false)
            setSearchResult(data)

        }catch(error){
            toast({
                title:"Error Occured",
                description:'Failed to load the Search Result',
                status:'error',
                duration:3000,
                isClosable:true,
                position:'bottom-left'
            })
            return;
            setLoading(false)
        }
    }

    const accessChat= async(userId)=>{
        try{
            setLoadingChat(true)
            const obj={
                headers:{
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const {data}=await axios.post('https://chatapp-demouse-2022.herokuapp.com/api/chats',{userId},obj)
            if (!chats.find((e)=>e._id===data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false)
            onClose();

        }catch(error){
            toast({
                title:'Error occured while fetching the chats',
                description:error.message,
                status:"warning",
                isClosable:true,
                duration:3000,
                position:'bottom-left'
            })
        }        
    }

    const user1=JSON.parse(localStorage.getItem('userInfo'))

    return (
        <>
            <Box d='flex' justifyContent='space-between' alignItems='center' bg='white' w='100%' p='5px 10px 5px 10px' borderWidth='5px' >
                <Tooltip hasArrow label='Search user to chat' placement='bottom-end' >
                    <Button variant='ghost' onClick={onOpen}><i className="fa-solid fa-magnifying-glass"></i>
                        <Text d={{ base: 'none', md: "flex" }} px='4'>Search user</Text>
                    </Button>
                </Tooltip>
                <Text fontSize='2xl' fontFamily='Work sans'>Talk-A-Tive</Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge count={notification.length}
                            effect={Effect.SCALE} />
                            <BellIcon fontSize='2xl' margin='1' />
                        </MenuButton>
                        <MenuList>
                            {!notification.length  && "No new messages"}
                            {notification.map((notif)=>(
                                <MenuItem key={notif._id} onClick={()=>{
                                    setSelectedChat(notif.chat);
                                    setNotification(notification.filter((n)=>n!==notif))
                                }} >
                                    {notif.chat.isGroupChat? `New Message in ${notif.chat.chatName}`
                                    :`New Message from ${getSender(user,notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button}  rightIcon={<ChevronDownIcon/>}> 
                        <Avatar size='sm' cursor='pointer' name={user1.name} src={user1.pic} />                          
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>
                            <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuItem onClick={logoutHandel}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px' >Search Users</DrawerHeader>
                    <DrawerBody>
                    <Box d='flex' pb='2' >
                        <Input placeholder='Search by name or email' mr={2} value={search} onChange={(e)=>setSearch(e.target.value)} />
                        <Button onClick={handelSearch}>Go</Button>
                    </Box>
                    {loading?(<ChatLoading/>):(
                        searchResult.map(user=>(
                            <UserListItem
                            key={user._id}
                            user={user}
                            handelFunction={()=>accessChat(user._id)}
                            />
                        ))
                    )}
                    {loadingChat && <Spinner ml='auto' d='flex' />}
                </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer