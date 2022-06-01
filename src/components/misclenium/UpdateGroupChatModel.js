import { useDisclosure } from '@chakra-ui/hooks'
import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input,  useToast } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import UserBadgeItem from '../UserAvathar/UserBadgeItem'
import {Spinner} from '@chakra-ui/spinner'
import UserListItem from '../UserAvathar/UserListItem'

function UpdateGroupChat({ fetchAgain, setFetchAgain, fetchMessages }) {

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState(false);

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { selectedChat, setSelectedChat, user } = ChatState();


  const handleAddUser=async(user1)=>{
    if(selectedChat.users.find((u)=>u._id===user1._id)){
      toast({
        title: "User Already in group",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    
    if(selectedChat.groupAdmin._id!==user._id){
      toast({
        title: "Only admin can add someone",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });  
      return; 
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `https://chatapp-demouse-2022.herokuapp.com/api/chats/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  } 

  const handleRemove=async(user1)=>{
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `https://chatapp-demouse-2022.herokuapp.com/api/chats/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  }

  const handleRename=async()=>{
    if(!groupChatName) return

    try {
      setRenameloading(true)

      const obj={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }

      const {data}=await axios.put('https://chatapp-demouse-2022.herokuapp.com/api/chats/rename',{
        chatId:selectedChat._id,
        chatName:groupChatName
      },obj)

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameloading(false)      
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameloading(false);      
    }
    setGroupChatName('')
  }

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`https://chatapp-demouse-2022.herokuapp.com/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };



  return (
    <>
      <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen}>Open Modal</IconButton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {
                selectedChat.users.map((u)=>(
                  <UserBadgeItem
                  key={user._id}
                  user={u}
                  handelFunction={()=>handleRemove(u)}
                  />
                ))
              }
            </Box>
            <FormControl d='flex' >
              <Input placeholder='Chat Name'
              mb={3}
              value={groupChatName}
              onChange={(e)=>setGroupChatName(e.target.value)} />
              <Button variant='solid'
              colorScheme='teal'
              ml={1}
              isLoading={renameloading}
              onClick={handleRename}
              >
                Update
                </Button>            
            </FormControl>
            <FormControl>
              <Input 
              placeholder='Add User to group'
              mb={1}
              onChange={(e)=>handleSearch(e.target.value)}
               />
            </FormControl>
            {loading?(
              <Spinner size='lg'/>
            ):(
              searchResult?.map((user)=>(
                <UserListItem
                key={user._id}
                user={user}
                handelFunction={()=>handleAddUser(user)}
                 />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={()=>handleRemove(user)} colorScheme='red' >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChat