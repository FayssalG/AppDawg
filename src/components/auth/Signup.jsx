import background from '../../Assets/background.jpg'

import React, {useState} from 'react'
import { Link as RouterLink , Navigate} from 'react-router-dom'
import {Container , Box , TextField , Button ,Link , FormHelperText} from '@mui/material'
import { useAuth } from '../../providers/AuthProvider'


export default function Signup() {
  const {signUp , user} = useAuth()  
  if(user){
    return <Navigate replace to='/'/>
  }

  const [credentials , setCredentials] = useState({email : '' , password : '' , rePassword : ''})
  const [error , setError] = useState()

  function handleChange(key , value){
    setCredentials((prev)=>{
        const newCreds = {...prev}
        newCreds[key]= value
        return newCreds
    })
  }

  function handleSubmit(e){
    e.preventDefault()
    let email = credentials.email
    let password = credentials.password
    let rePassword = credentials.rePassword
    signUp(email , password , rePassword , setError)
  }


  return (
    <Box  sx={{height:'100svh', backgroundImage: `url(${background})` , backgroundSize:'cover'}}>
        <form onSubmit={handleSubmit}>
            <Box 
                maxWidth={300}
                pt={10}
                mx='auto'
                display='flex'
                flexDirection='column' 
                gap={2} 
            >   
               
                <TextField error={error ? true : false} onChange={(e)=>handleChange('email' , e.target.value)} required  label='Email' variant='filled'/>
                <TextField error={error ? true : false} onChange={(e)=>handleChange('password' , e.target.value)} required type='password' label='Password' variant='filled'/>
                <TextField error={error ? true : false} onChange={(e)=>handleChange('rePassword' , e.target.value)} required type='password' label='Repeat Password' variant='filled'/>
                {error!=null && <FormHelperText error >{error}</FormHelperText>}
                

                <Button  type='submit' variant='contained' color='secondary'>Sign Up</Button>
                <span>
                  Already have an account ? <Link component={RouterLink} to='/login'>Login</Link>
                </span>
            </Box>
                
        </form>
    </Box>
    
  )
}
