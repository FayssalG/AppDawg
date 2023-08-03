import React, { useState , useReducer } from 'react'
import {Box  , AppBar ,Grid , Typography, Paper } from '@mui/material'

import Topbar from './Topbar'
import Profil from './Profil'
import Contacts from './Contacts/Contacts'
import Discussions from './Discussions/Discussions'



export default function Sidebar({id , signOut , userData}) {
    const [showProfil , setShowProfil] = useState(false) 
    const [showContacts , setShowContacts] = useState(false)


    return (
      <Box  >
          <Box
            height='94vh' 
            //backgroundColor='primary.dark'  
            position={'relative'} 
          >
              <Box >
                <Topbar onShowContacts={setShowContacts} onShowProfil={setShowProfil} signOut={signOut} userPhoto={userData.photoURL}/>                        
                <Typography  p={1} component='span' fontSize={12} color='grey' marginLeft='auto'> Your Id : {id}</Typography> 
              </Box>
              <Box  >
                  <Profil    onShowProfil={setShowProfil} showProfil={showProfil}/>
                  <Contacts onShowContacts={setShowContacts} showContacts={showContacts} />
                  <Discussions/>
                  
              </Box>
          </Box>           
      </Box>
  )
}
