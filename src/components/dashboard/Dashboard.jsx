import background from '../../Assets/background.jpg'
import React, { useState , useEffect} from 'react'
import { useAuth } from '../../providers/AuthProvider'
import useChatId from '../../hooks/useChatId'
import { Navigate } from 'react-router-dom'

import VerifyEmail from './VerifyEmail'
import Sidebar from './sidebar/Sidebar'

import { Divider, Grid , useMediaQuery , useTheme} from '@mui/material'

import OpenDiscussion from './disscussion/OpenDiscussion'
import OpenDiscussionMobile from './disscussion/OpenDiscussionMobile'

import DiscussionsProvider from '../../providers/DiscussionsProvider'
import ContactsProvider from '../../providers/ContactsProvider'
import SocketProvider from '../../providers/SocketProvider'
import { useUser } from '../../providers/UserProvider'


export default function Dashboard() {  
    const { signOut , resendVerificationEmail} = useAuth()
    const {userData , user , id} = useUser()

    const theme= useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('md'))
    
    if(!user){
      return <Navigate replace to='/login'/>
    }
  
 
    // if(!user.emailVerified) {
    //   return( 
    //   <VerifyEmail signOut={signOut} resendVerificationEmail={resendVerificationEmail}/>  
    //   )
    // }


    return (     
      <SocketProvider id={id}>         
        <DiscussionsProvider>
          <ContactsProvider>
           
            <Grid container spacing={2}  overflow='hidden' backgroundColor='primary.dark' padding={2}  >
              <Grid item xs={12} md={3.7}  >
                <Sidebar id={id} signOut={signOut} userData={userData}/>      
              
              </Grid>
              
              <Grid item  xs={0} md={8.3} sx={{ backgroundImage:`url('${background}')` , backgroundRepeat:'no-repeat',backgroundSize:'cover', backgroundPosition:'center'}}>
                  {matches ? <OpenDiscussion /> : <OpenDiscussionMobile />} 
              </Grid>
            </Grid>

            </ContactsProvider>
          </DiscussionsProvider>
      </SocketProvider>
    )
}
