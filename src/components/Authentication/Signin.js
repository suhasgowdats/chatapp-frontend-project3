import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


function Signin() {
    const [show, setShow] = useState(false)
    const [show1, setShow1] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPws, setConfirmPws] = useState()
    const [pic, setPic] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const nav=useNavigate()
    

    const handelClick = () => {
        setShow(!show)
    }

    const handelClick1 = () => {
        setShow1(!show1)
    }

    const postPic = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please select an imagee',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            });
            return;
        }

        if (pics.type === 'image/jpeg' || pics.type || 'image/png') {
            const data=new FormData()
            data.append('file',pics)
            data.append('upload_preset','chat-app')
            data.append('cloud_name','guvi-class')
            fetch('https://api.cloudinary.com/v1_1/guvi-class/image/upload',{
                method:"post",
                body:data
            }).then((res)=>res.json())
            .then((data)=>{
                setPic(data.url.toString())
                console.log(data.url.toString())
                setLoading(false)
            }).catch((err)=>{
                console.log(err)
                setLoading(false)
            })
        }else{
            toast({
                title: 'Please upload image in png or jpeg formate',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            });  
            setLoading(false)    
            return      
        }
    }

    const handelSubmit =async() => {
        setLoading(true)
        if(!name || !email || !password || !confirmPws){
            toast({
                title: 'Please enter all details',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            });    
            setLoading(false);
            return;         
        }

        if(password!=confirmPws){
            toast({
                title: 'Please confirm the password',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            });   
            setLoading(false)  
            return       
        }
        try{
            const obj={
                method:"POST",
                headers:{
                    'Content-type':'Application/json'
                },
                data:{name,email,password,pic}
            }
            

            const {data}=await axios('https://chatapp-demouse-2022.herokuapp.com/api/user',obj)
            toast({
                title: 'Registration successfull',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            }); 
            setLoading(false)
            localStorage.setItem('userInfo',JSON.stringify(data));
            nav('/chats');
        }catch(error){
            toast({
                title: 'Error occured',
                description:error.response.data.message,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            }); 
        }
    }

    return (
        <VStack spacing='2px'>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Enter your name' onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password'>
                <FormLabel>Create Password</FormLabel>
                <InputGroup>
                    <Input type={show ? 'text' : 'password'} placeholder='Create Password' onChange={(e) => setPassword(e.target.value)} isRequired />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handelClick}>
                            {show ? "Hide" : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='password1'>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show1 ? 'text' : 'password'} placeholder='Confirm Password' onChange={(e) => setConfirmPws(e.target.value)} isRequired />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handelClick1}>
                            {show1 ? "Hide" : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic'>
                <FormLabel>Upload profile pic</FormLabel>
                <Input type='file' accept='image/*' onChange={(e) => postPic(e.target.files[0])} />
            </FormControl>
            <Button colorScheme='blue' isLoading={loading} width='100%' style={{ marginTop: '5px' }} onClick={handelSubmit}>Submit</Button>
        </VStack>
    )
}

export default Signin