import React, { useMemo } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ArrowBack } from '@mui/icons-material'

import {Paper , Box , Avatar , IconButton , AppBar , Toolbar , Typography} from '@mui/material'
import { useOtherUsers } from '../../../providers/OtherUsersProvider';

export default function TopbarDiscussion({showDiscussion , onShowDiscussion ,recipient}) {

  const {connectedRecipients} = useOtherUsers()
  const isConnected = useMemo(()=>{
    return connectedRecipients.includes(recipient.id)
  },[connectedRecipients])

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
       
        <Box>
          <IconButton>
            <Avatar />
          </IconButton>
        </Box>
        
        <Box ml={1} mt={1}>
          <Typography variant='body1' lineHeight={.9} fontSize={19}>{recipient.name}</Typography>
          <Typography variant='caption' color='primary.light'>{isConnected ? 'Online' : 'offline'}</Typography>
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
