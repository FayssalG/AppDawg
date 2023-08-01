import React from 'react'
import {Box ,  IconButton , Avatar, Typography} from '@mui/material'
import { useAuth } from '../../../providers/AuthProvider'

export default function Message({messageRef , userId,senderId ,senderName , content}) {
  const bubbleColor = userId==senderId ?  'primary.main' : 'topbar.main'
  
  return (
    <Box  
      ref={messageRef} 
      alignSelf={userId==senderId && 'end'}
      textAlign={userId==senderId && 'right'} 
      position='relative' 
      display='flex' alignItems='start' width='fit-content'>
        {
          userId!=senderId &&
          <IconButton>
            <Avatar sx={{width:30 , height:30}}/>
          </IconButton>
        }
        
        <Box maxWidth={400} marginLeft={1}> 
        
          <Typography  marginBottom={.5}  color='cyan' fontSize={12} >~ {senderName}</Typography>
          <Typography   
            position='relative' 
            backgroundColor={bubbleColor}  
            borderRadius='5px' 
            padding={1}
            sx={{
                overflowWrap:'break-word',
                ':after':
                  {content:'""', 
                  transform:userId==senderId ? ' skew(-45deg)' : 'skew(45deg)',
                  backgroundColor: bubbleColor,
                  height:4,
                  width:10 ,
                  right:userId==senderId ? -2 : '90%',
                  top:0,
                  position:'absolute'}}} 
          >
            {content}
          </Typography>
        </Box>
    </Box>
  )
}
