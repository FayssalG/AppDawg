import React, { useEffect, useRef, useState } from 'react'
import { Navigate, Link as RouterLink } from 'react-router-dom';

import {Grid ,Container , Button , TextField, Box , Divider , Link, FormHelperText} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../providers/AuthProvider'


export default function Login() {
  const {googleSignIn, anonymousSignIn , signIn , user} = useAuth()
 
  if(user){
    return <Navigate replace to='/'/>
  }
  
  const [credentials , setCredentials] = useState({email : '' , password : '' })
  const [error , setError] = useState()

  function handleChange(key , value){
    setCredentials((prev)=>{
      const newCreds = {...prev}
      newCreds[key] = value
      return newCreds
    })
  }

  function handleSubmit(e){
    e.preventDefault()
    let email = credentials.email
    let password  = credentials.password
    signIn(email ,password , setError)
 
  }

  function handleAnonymousSignIn(){
    anonymousSignIn()
  }
  

  return (
    <Container  >
        <Box
            maxWidth={300}
            mx='auto'
            pt={20}
            height={500}
            display='flex'
            flexDirection='column'
        >            
            <form onSubmit={handleSubmit}>
              <Box  sx={{mb:4,display:'flex',gap:1}} flexDirection='column'>
                <TextField error={error ? true : false} required onChange={(e)=>handleChange('email' , e.target.value)}  sx={{mb:2 }} label='Email' variant='filled' />
                <TextField error={error ? true : false} required  onChange={(e)=>handleChange('password' , e.target.value)}  type='password' label='Password' variant='filled' />
                {error!=null && <FormHelperText error >email or password incorrect</FormHelperText>}
                
                <Button sx={{mb:1 }} color='secondary' variant='contained' type='submit'>Sign in</Button>
                <Link component={RouterLink} to='/signup' >Create an Account</Link>
              </Box>
            </form>        
            
            <Divider sx={{mb:4}}>Or</Divider>

            <Button sx={{mb:2}} startIcon={<GoogleIcon/>} onClick={googleSignIn}  variant="outlined" >
                Continue with Google
            </Button>

            <Button startIcon={<PersonIcon/>}  variant="contained" onClick={handleAnonymousSignIn}>Sign in as a guest</Button>

        </Box>
    </Container>
  )
}
