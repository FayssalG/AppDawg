import background from '../../Assets/background.jpg'
import React, { useState , useEffect} from 'react'
import { useAuth } from '../../providers/AuthProvider'
import useChatId from '../../hooks/useChatId'
import { Navigate } from 'react-router-dom'

import VerifyEmail from './VerifyEmail'
import Sidebar from './sidebar/Sidebar'

import { Divider, Grid , useMediaQuery , useTheme} from '@mui/material'

import OpenDiscussion from './disscussion/OpenDiscussion'

import DiscussionsProvider from '../../providers/DiscussionsProvider'
import ContactsProvider from '../../providers/ContactsProvider'
import SocketProvider from '../../providers/SocketProvider'
import OtherUsersProvider from '../../providers/OtherUsersProvider'

import { useUser } from '../../providers/UserProvider'
import ChooseName from './ChooseName'


export default function Dashboard() {  
    const { signOut , resendVerificationEmail} = useAuth()
    const {userData , user , id } = useUser()

    
    if(!user){
      return <Navigate replace to='/login'/>
    }
  
 
    // if(!user.emailVerified) {
    //   return( 
    //   <VerifyEmail signOut={signOut} resendVerificationEmail={resendVerificationEmail}/>  
    //   )
    // }

    console.log(typeof(userData))
    if(typeof(userData)=='object' && userData.displayName == null){
      return <ChooseName/>
    }

    return (     
      <SocketProvider id={id}>
        <OtherUsersProvider>   

          <ContactsProvider>      
            <DiscussionsProvider>

              <Grid container spacing={2}  overflow='hidden' backgroundColor='primary.dark' padding={2}  >
                <Grid item xs={12} md={3.7}  >
                  <Sidebar id={id} signOut={signOut} userData={userData}/>      
                
                </Grid>
                
                <Grid item  xs={0} md={8.3} sx={{ backgroundImage:`url('${background}')` , backgroundRepeat:'no-repeat',backgroundSize:'cover', backgroundPosition:'center' }}>
                    <OpenDiscussion /> 
                </Grid>
              </Grid>
              
            </DiscussionsProvider>
          </ContactsProvider>
        </OtherUsersProvider>
      </SocketProvider>
    )
}
