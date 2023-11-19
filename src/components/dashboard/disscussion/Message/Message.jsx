import React, { useEffect, useState } from 'react'
import {Box ,  IconButton , Avatar, Typography,Menu, MenuItem} from '@mui/material'

import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';

import { useAuth } from '../../../../providers/AuthProvider'
import ClickedImage from './ClickedImage';
import { ExpandMore } from '@mui/icons-material';
import { useDiscussions } from '../../../../providers/DiscussionsProvider';


export default function Message({messageRef , userId, message , onDelete}) {
  const {senderId ,senderName , content} = message
  const isUser = userId == senderId

  
  const bubbleColor = isUser ?  'primary.main' : 'topbar.main'

  const [attachment , setAttachment] = useState(null)
  const [showImage , setShowImage] = useState(false)

  const [anchorEl , setAnchorElUser] = useState(false)
  function handleOpenMenu(e){
    setAnchorElUser(e.currentTarget)
  }
  function handleCloseMenu(){
    setAnchorElUser(false)
  }

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
          {/* {
            !isUser &&
            <IconButton>
              <Avatar sx={{width:30 , height:30}}/>
            </IconButton>
          }
           */}
          <Box maxWidth={400} marginLeft={1}> 
          
            {/* <Typography  marginBottom={.5}  color='cyan' fontSize={12} >~ {senderName}</Typography> */}
            <Box   
              position='relative' 
              backgroundColor={bubbleColor}  
              borderRadius='5px' 
              padding={.5}
              paddingTop={0}
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
              <Box  position='relative' height={10} mb={2}>
                <IconButton onClick={handleOpenMenu} sx={{position:'absolute' , left:0 , top:0 ,paddingInline:0}} >
                  <ExpandMore sx={{width:15,height:15 }}/>
                </IconButton>
                <Menu  anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                  <MenuItem onClick={()=>onDelete(message)}>Delete</MenuItem>
                </Menu>
              </Box>

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
