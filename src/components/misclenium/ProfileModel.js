import React from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,Button, Image, Text } from '@chakra-ui/react'
import {useDisclosure} from "@chakra-ui/hooks"
import { ViewIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'




function ProfileModel({user,  children}) {



    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
    {
        children ?(<span onClick={onOpen}>{children}</span>):(<IconButton d={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen} />)
    }
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h='410px'>
          <ModalHeader fontSize='40px'fontFamily='Work sans' d='flex' justifyContent='center' >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody d='flex' flexDir='column' alignItems='center' justifyContent='space-between'>
            <Image borderRadius='full' boxSize='150px' src={user.pic} alt={user.name}/>
            <Text fontSize={{base:'28px', md:'30px'}} fontFamily='Work sans' >{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModel