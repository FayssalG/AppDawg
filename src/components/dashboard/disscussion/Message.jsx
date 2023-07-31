import React from 'react'
import {Box ,  IconButton , Avatar, Typography} from '@mui/material'
import { useAuth } from '../../../providers/AuthProvider'

export default function Message({messageRef , userId,senderId ,senderName , content}) {
  
  return (
    <Box  
      ref={messageRef} 
      alignSelf={userId==senderId && 'end'}
      textAlign={userId==senderId && 'right'} 
      position='relative' 
      display='flex' alignItems='start' width='fit-content'>
        {
          userId!=senderId &&
          <IconButton >
            <Avatar sx={{width:30 , height:30}}/>
          </IconButton>
        }
        
        <Box maxWidth={400}  >
          <Typography  marginBottom={.5}  color='cyan' fontSize={12} >~ {senderName}</Typography>
          <Typography sx={{overflowWrap:'break-word'}}   backgroundColor='primary.main'  borderRadius='5px' padding={1}>{content}</Typography>
        </Box>
    </Box>
  )
}
