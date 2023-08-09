import React, { useMemo } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ArrowBack } from '@mui/icons-material'

import {Paper , Box , Avatar , IconButton , AppBar , Toolbar , Typography} from '@mui/material'
import { useOtherUsers } from '../../../providers/OtherUsersProvider';

export default function TopbarDiscussion({recipient ,showContactInfos , onShowContactInfos ,showDiscussion , onShowDiscussion }) {
  const {connectedUsers} = useOtherUsers()
  let connectionStatus =useMemo(()=>{
    if(!connectedUsers[recipient.id]) return 'offline'
    
    if(connectedUsers[recipient.id] == 'online') return 'online'
  
    let date = new Date(connectedUsers[recipient.id])
    
    if(date.getDay() == new Date().getDay()){
      return 'Online Today at '+ date.toLocaleTimeString(
        'en-gb',{hour:'numeric', minute : 'numeric'}
      )
    }  

    return 'Online on'+ date.toLocaleDateString(
      'en-gb', { year:'numeric', month : 'numeric', day:'numeric'}
    )

  },[connectedUsers , recipient]) 

  return (
    <AppBar 
      
      sx={{ borderRadius:'10px', borderColor:'primary.main' , height:70 , boxShadow:0 , backgroundColor:'topbar.main'}} 
      position='static' 
    >
    <Toolbar display='flex' sx={{py:1,alignItems:'center'}}>
        { 
          showDiscussion ?
          <Box> 
            <IconButton onClick={()=>onShowDiscussion(false)}>
              <ArrowBack/>
            </IconButton>
          </Box> 
          : null
        }
       
        <Box onClick={()=>onShowContactInfos(true)} sx={{cursor:'pointer'}} display='flex' alignItems='center' >    
          <Box>
            <IconButton>
              <Avatar />
            </IconButton>
          </Box>
          
          <Box ml={1} mt={1}  >
            <Typography  variant='body1' lineHeight={.9} fontSize={19}>{recipient.name}</Typography>
            <Typography variant='caption' color='primary.light'>{connectionStatus }</Typography>
          </Box>            
        </Box>
        
        <Box ml='auto' >
          <IconButton >
            <MoreVertIcon/>            
          </IconButton>
        </Box>
      
    </Toolbar>      
  
  </AppBar>

  )
}
