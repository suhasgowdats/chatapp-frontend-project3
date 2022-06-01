import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useToast,
    FormControl,
    Input,
    Box
  } from '@chakra-ui/react'
  import {useDisclosure} from '@chakra-ui/hooks'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvathar/UserListItem';
import UserBadgeItem from '../UserAvathar/UserBadgeItem';

function GroupChatModel({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName]=useState();
    const [selectedUsers, setSelectedUsers]=useState([]);
    const [search, setSearch]=useState('');
    const [searchResult, setSearchResult]=useState([]);
    const [loading, setLoading]=useState(false);
    
    const toast=useToast();

    const { user, chats, setChats}=ChatState()

    const handelSearch=async(query)=>{
        setSearch(query);
        if(!query){
            return
        }

        try{
            setLoading(true)

            const obj={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                }
            }

            const {data}=await axios.get(`https://chatapp-demouse-2022.herokuapp.com/api/user?search=${search}`,obj)
            console.log(data)
            setLoading(false)
            setSearchResult(data);


        }catch(error){
            toast({
                title:'Error occured',
                description:"Failed to load the search result",
                status:"error",
                isClosable:true,
                duration:3000,
                position:'bottom-left'
            })
        }
    }

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
          toast({
            title: "Please fill all the feilds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
        }
    
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.post(
            'https://chatapp-demouse-2022.herokuapp.com/api/chats/group',
            {
              name: groupChatName,
              users: JSON.stringify(selectedUsers.map((u) => u._id)),
            },
            config
          );
          console.log(data)
          setChats([data, ...chats]);
          onClose();
          toast({
            title: "New Group Chat Created!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        } catch (error) {
          console.log(error)
          toast({
            title: "Failed to Create the Chat!",
            description: error.response.data,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      };
    
    
    const handelDelete=(delUser)=>{
        setSelectedUsers(selectedUsers.filter((sel)=>sel._id !==delUser._id ))
    }

    const handelGroup=(userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
            toast({
                title:'Error occured',
                description:"Failed to load the search result",
                status:"error",
                isClosable:true,
                duration:3000,
                position:'bottom-left'
            });
            return;            
        }
        setSelectedUsers([...selectedUsers,userToAdd])
    }


  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize='35px' fontFamily='Work sans' justifyContent='center'
          >Create Group Chat</ModalHeader>
          <ModalCloseButton d='flex' flexDir='column' alignItems='center' />
          <FormControl>
              <Input placeholder='Chat name' mb={3} onChange={(e)=>setGroupChatName(e.target.value)}  />
          </FormControl>
          <FormControl>
              <Input placeholder='Add Users eg:Manu, Suhas' mb={3} onChange={(e)=>handelSearch(e.target.value)}  />
          </FormControl>
          <Box w='100%' d='flex' flexWrap='wrap'  >
          {selectedUsers.map((u)=>(
              <UserBadgeItem 
              key={u._id}
              user={u}
              handelFunction={()=>handelDelete(u)} />
          ))}
          </Box>
          {
              loading?(<div>loading...</div>):(
                  searchResult?.slice(0,4).map((user)=><UserListItem key={user._id} user={user} handelFunction={()=>{handelGroup(user)}}/>)
              )
          }
          <ModalBody >
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue'  onClick={()=>handleSubmit()}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModel