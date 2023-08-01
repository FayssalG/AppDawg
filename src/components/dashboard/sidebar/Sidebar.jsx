import React, { useState , useReducer } from 'react'
import {Box  , AppBar ,Grid , Typography, Paper } from '@mui/material'

import Topbar from './Topbar'
import Profil from './Profil'
import Contacts from './Contacts/Contacts'
import Discussions from './Discussions/Discussions'

function reducer(state , action){
    switch(action.type){
      case 'displayname':
        return {...state , displayName:action.payload};
      case 'caption':
        return {...state , caption:action.payload};
      case 'photourl':
        return {...state , photoURL:action.payload};
    }
  }

export default function Sidebar({id , signOut , user}) {
    const [showProfil , setShowProfil] = useState(false) 
    const [showContacts , setShowContacts] = useState(false)

    const [userInfo , dispatch] = useReducer(reducer , {displayName:user.displayName , infos:'' , photoURL:user.photoURL})

    return (
      <Box  >
          <Box 
              height='100vh' 
              backgroundColor='primary.dark'  
              position={'relative'} 
          >
              <Box >
               {/* <Typography  p={1} component='span' fontSize={12} color='grey' marginLeft='auto'> Your Id : {id}</Typography>  */}
                <Topbar onShowContacts={setShowContacts} onShowProfil={setShowProfil} signOut={signOut} userPhoto={userInfo.photoURL}/>                        
              </Box>
              <Box  >
                  <Profil dispatch={dispatch} caption={userInfo.infos} photoURL={userInfo.photoURL} displayName={userInfo.displayName}  onShowProfil={setShowProfil} showProfil={showProfil}/>
                  <Contacts onShowContacts={setShowContacts} showContacts={showContacts} />
                  <Discussions/>
                  
              </Box>
          </Box>           
      </Box>
  )
}
