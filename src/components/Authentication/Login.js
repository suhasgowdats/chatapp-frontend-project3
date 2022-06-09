import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


function Login() {
    const [show2, setShow2] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [login, setLogin] = useState()
    const nav = useNavigate()
    const toast = useToast()
    

    const handelClick2 = () => {
        setShow2(!show2)
    }

    const submitLog =async () => {
        setLogin(true);
        if(!email || !password){
            toast({
                title: 'Please enter all fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            });
            setLogin(false)
            return
        }

        try{
            // console.log(password)
            // console.log(email)
            const obj={
                method:"POST",
                data:{email,password},
                headers:{
                    'Content-type':'Application/json'
                }
            }

            const {data}=await axios("https://chatapp-demouse-2022.herokuapp.com/api/user/login",obj)
            // console.log(data);
            toast({
                title: 'Login successfull',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            }); 
            localStorage.setItem("userInfo",JSON.stringify(data))
            setLogin(false);
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
            setLogin(false)
        }
    }


    return (
        <VStack spacing='5px'>
            <FormControl id='email'>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} isRequired />
            </FormControl >
            <FormControl id='password2'>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show2 ? 'text' : 'password'} value={password} placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} isRequired />
                    <InputRightElement >
                        <Button h='1.75rem' size='sm' onClick={handelClick2}>
                            {show2 ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button colorScheme='blue' isLoading={login} width='100%' style={{ marginTop: '15px' }} onClick={submitLog}>Login</Button>
            <Button variant='solid' colorScheme='red' width='100%' onClick={() => { setEmail('guest@example.com'); setPassword('12345') }}>Guest User Credentials</Button>
        </VStack>
    )
}

export default Login