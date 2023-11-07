import React, { useEffect, useState } from 'react'
import {Box ,  IconButton , Avatar, Typography} from '@mui/material'

import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';

import { useAuth } from '../../../../providers/AuthProvider'
import ClickedImage from './ClickedImage';


export default function Message({messageRef , userId, message}) {
  const {senderId ,senderName , content} = message
  const isUser = userId == senderId
  const bubbleColor = isUser ?  'primary.main' : 'topbar.main'

  const [attachment , setAttachment] = useState(null)
  const [showImage , setShowImage] = useState(false)

  function handleShowImage(){
    if(attachment) setShowImage(URL.createObjectURL(attachment))
  }
  function handleCloseImage(){
    setShowImage(false)
  }

  useEffect(()=>{
    if(!message.attachment) return
    fetch(message.attachment.data)
    .then((dataUrl)=>{
      return dataUrl.blob()
    })
    .then((blob)=>{
      setAttachment(blob)
    })
    
  },[message])

  return (
    <>
      {showImage && <ClickedImage imageName={message.attachment.name} image={showImage} onClose={handleCloseImage}/>}
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
              padding={.5}
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
              {
                attachment && 
                <Box onClick={handleShowImage} maxWidth='200px' height='200px' mb='.5rem' sx={{cursor:'pointer'}} >
                  <img style={{width:'100%' , height:'100%' , objectFit:'cover'}} src={URL.createObjectURL(attachment)}/>
                </Box>
              }
              
              <Typography marginBottom={1}  >{content}</Typography>
              <Typography width='100%'  maxHeight={10} display='flex' justifyContent='end' alignItems='center' fontSize={10} gap={.5}>
                  {message.time} 
                  {isUser  ? 
                    <>
                      {
                        message.isReceived  ? 
                          <DoneAllIcon color={message.isSeen ? 'secondary' : ''}  sx={{width:12}}/>
                          :
                          <DoneIcon sx={{width:12}}/>
                      } 
                    </>
                  : null}
              </Typography>
            </Box>
          </Box>
      </Box>
    </>
  )
}
