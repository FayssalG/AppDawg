import React, { useState , useEffect} from 'react'
import { useAuth } from '../../providers/AuthProvider'
import useChatId from '../../hooks/useChatId'
import { Navigate } from 'react-router-dom'

import VerifyEmail from './VerifyEmail'
import Sidebar from './sidebar/Sidebar'

import { Divider, Grid } from '@mui/material'
import OpenDiscussion from './disscussion/OpenDiscussion'

import DiscussionsProvider from '../../providers/DiscussionsProvider'
import ContactsProvider from '../../providers/ContactsProvider'
import SocketProvider from '../../providers/SocketProvider'

export default function Dashboard() {  
    const {user , signOut , resendVerificationEmail} = useAuth()

    if(!user){
      return <Navigate replace to='/login'/>
    }
    // if(!user.emailVerified) {
    //   return( 
    //   <VerifyEmail signOut={signOut} resendVerificationEmail={resendVerificationEmail}/>  
    //   )
    // }

    const [id] = useChatId(user.uid)
    
    return (     
      <SocketProvider id={id}>         
        <DiscussionsProvider>
          <ContactsProvider>
            
            <Grid container spacing={0} overflow='hidden'>
              <Grid item xs={3.7}>
                <Sidebar id={id} signOut={signOut} user={user}/>      
              
              </Grid>
    
              <Grid item xs={8.3} >
                  <OpenDiscussion id={id} /> 
              </Grid>
            </Grid>

            </ContactsProvider>
          </DiscussionsProvider>
      </SocketProvider>
    )
}
