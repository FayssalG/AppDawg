import React from 'react'
import {Box ,  IconButton , Avatar, Typography} from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll';

import { useAuth } from '../../../providers/AuthProvider'

export default function Message({messageRef , userId, message}) {
  const {senderId ,senderName , content} = message
  const isUser = userId == senderId
  const bubbleColor = isUser ?  'primary.main' : 'topbar.main'

  return (
    <Box  
      ref={messageRef} 
      alignSelf={isUser && 'end'}
      textAlign={isUser && 'right'} 
      position='relative' 
      display='flex' alignItems='start' width='fit-content'>
        {
          !isUser &&
          <IconButton>
            <Avatar sx={{width:30 , height:30}}/>
          </IconButton>
        }
        
        <Box maxWidth={400} marginLeft={1}> 
        
          <Typography  marginBottom={.5}  color='cyan' fontSize={12} >~ {senderName}</Typography>
          <Box   
            position='relative' 
            backgroundColor={bubbleColor}  
            borderRadius='5px' 
            padding={1}
            sx={{
                overflowWrap:'break-word',
                ':after':
                  {content:'""', 
                  transform:isUser ? ' skew(-45deg)' : 'skew(45deg)',
                  backgroundColor: bubbleColor,
                  height:4,
                  width:10 ,
                  right:isUser ? -2 : '90%',
                  top:0,
                  position:'absolute'}}} 
          >
            <Typography marginBottom={1} >{content}</Typography>
            <Typography width='100%' maxHeight={10} display='flex' justifyContent='end' alignItems='center' fontSize={10} gap={.5}>
                22:21 
                {isUser  ? <DoneAllIcon /*color='secondary'*/ sx={{width:12}}/> : null}
            </Typography>
          </Box>
        </Box>
    </Box>
  )
}
