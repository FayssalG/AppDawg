import React, { useCallback, useRef, useState } from 'react'
import Message from './Message'
import TopbarDiscussion from './TopbarDiscussion';

import { SendSharp  } from '@mui/icons-material'

import { Box ,  FormControl , OutlinedInput , IconButton } from '@mui/material'
import { useAuth } from '../../../providers/AuthProvider'
import { useDiscussions } from '../../../providers/DiscussionsProvider'

export default function OpenDiscussion({id}) {
  const {user} = useAuth()
  const {addMessageToDiscussion , activeDiscussion} = useDiscussions()

  const setRef = useCallback((element)=>{
    if(element) element.scrollIntoView({smooth:true})
  },[])

  const messageInputRef = useRef(null)

  if(activeDiscussion == null) return



  function handleMessageSend(e){
    e.preventDefault()    
    let messageContent = messageInputRef.current.value
    if(messageContent == '') return
    addMessageToDiscussion(activeDiscussion.recipients ,  {senderId:id,senderName:user.displayName , content:messageContent })
    messageInputRef.current.value = ''
  }
  
  const messages = activeDiscussion.messages

  return (
    <Box height='100vh' display='flex' flexDirection='column'  position='relative'>
      
      <TopbarDiscussion recipients={activeDiscussion.recipients}/>
      
      <Box  overflow='auto' px={4} py={2} display='flex' flexDirection='column'  gap={2}>
        {
          messages.map((msg , index)=>{
            const lastRef = messages.length - 1 === index
            return  <Message key={index} messageRef={lastRef ? setRef : null}  userId={id} senderId={msg.senderId} senderName={msg.senderName} content={msg.content}/>
          })
        }
      </Box>

      <Box padding={2} width='100%' marginTop='auto'>
    
        <form onSubmit={handleMessageSend}>
          <FormControl sx={{width:'100%'}} variant="standard"  >
            <OutlinedInput  inputRef={messageInputRef} placeholder='message' endAdornment={
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
