import React, { useCallback, useRef, useState } from 'react'
import Message from './Message'
import TopbarDiscussion from './TopbarDiscussion';

import { SendSharp  } from '@mui/icons-material'

import { Box ,  FormControl , OutlinedInput , IconButton } from '@mui/material'
import { useAuth } from '../../../providers/AuthProvider'
import { useDiscussions } from '../../../providers/DiscussionsProvider'
import { useUser } from '../../../providers/UserProvider';

export default function OpenDiscussion() {
  
  const {userData , id} = useUser()
  const {addMessageToDiscussion , activeDiscussion} = useDiscussions()

  const setRef = useCallback((element)=>{
    if(element) element.scrollIntoView({smooth:true})
  },[])

  const messageInputRef = useRef(null)

  if(!activeDiscussion) return



  function handleMessageSend(e){
    e.preventDefault()    
    let messageContent = messageInputRef.current.value
    if(messageContent == '') return
    addMessageToDiscussion(activeDiscussion.discussionId ,  activeDiscussion.recipient ,  {senderId:id,senderName:userData.displayName , content:messageContent })
    messageInputRef.current.value = ''
  }
  
  const messages = activeDiscussion.messages

  return (
    <Box 
    
      //boxShadow='-.2px 0 0 grey'
      height='94vh' 
      display='flex' 
      flexDirection='column'  
      position='relative'>
      
      <TopbarDiscussion recipient={activeDiscussion.recipient}/>
      
      <Box  overflow='auto' px={2} py={2} display='flex' flexDirection='column'  gap={2}>
        {
          messages.map((msg , index)=>{
            const lastRef = messages.length - 1 === index
            return  <Message key={index} messageRef={lastRef ? setRef : null}  userId={id} senderId={msg.senderId} senderName={msg.senderName} content={msg.content}/>
          })
        }
      </Box>

      <Box
        borderRadius='10px'
        backgroundColor='primary.dark'  
        padding={1.5} 
        width='100%' 
        marginTop='auto' >
    
        <form onSubmit={handleMessageSend} >
          <FormControl sx={{width:'100%'}} variant="standard"   >
            <OutlinedInput  sx={{height:45,  }} inputRef={messageInputRef} placeholder='message' endAdornment={
              <IconButton type='submit'>
                <SendSharp/>
              </IconButton>
            } />
          </FormControl>
        </form>
        
      </Box>
     
    </Box>
  )
}
