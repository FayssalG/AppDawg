import React, { useCallback, useEffect, useRef, useState } from 'react'
import Message from './Message'
import TopbarDiscussion from './TopbarDiscussion';

import { SendSharp  } from '@mui/icons-material'

import {Slide , Box ,  FormControl , OutlinedInput , IconButton } from '@mui/material'
import { useAuth } from '../../../providers/AuthProvider'
import { useDiscussions } from '../../../providers/DiscussionsProvider'
import Discussions from '../sidebar/Discussions/Discussions';

export default function OpenDiscussion({id}) {
  const {user} = useAuth()
  const {addMessageToDiscussion, discussions , activeDiscussion} = useDiscussions()

  const [showDiscussion , setShowDiscussion] = useState(true)

  useEffect(()=>{
    console.log(activeDiscussion)
    setShowDiscussion(true)
  },[discussions])

  const setRef = useCallback((element)=>{
    if(element) element.scrollIntoView({smooth:true})
  },[])

  const messageInputRef = useRef(null)

  if(!activeDiscussion) return



  function handleMessageSend(e){
    e.preventDefault()    
    let messageContent = messageInputRef.current.value
    if(messageContent == '') return
    addMessageToDiscussion(activeDiscussion.recipients ,  {senderId:id,senderName:user.displayName , content:messageContent })
    messageInputRef.current.value = ''
  }
  
  const messages = activeDiscussion.messages

  return (
    <Slide sx={{position:'fixed' , top:0 , right:0,width:'100%'}} direction='left' in={showDiscussion} unmountOnExit mountOnEnter>

        <Box 
          backgroundColor='primary.dark'
          boxShadow='-.2px 0 0 grey' 
          height='90vh' 
          display='flex' 
          flexDirection='column'  
          position='relative'>
        
        <TopbarDiscussion showDiscussion={showDiscussion} onShowDiscussion={setShowDiscussion} recipients={activeDiscussion.recipients}/>
        
        <Box  overflow='auto' px={2} py={2} display='flex' flexDirection='column'  gap={2}>
            {
            messages.map((msg , index)=>{
                const lastRef = messages.length - 1 === index
                return  <Message key={index} messageRef={lastRef ? setRef : null}  userId={id} senderId={msg.senderId} senderName={msg.senderName} content={msg.content}/>
            })
            }
        </Box>

        <Box
            backgroundColor='primary.dark'  
            padding={1.5} 
            width='100%' 
            marginTop='auto' >
        
            <form onSubmit={handleMessageSend}>
              <FormControl sx={{width:'100%'}} variant="standard"   >
                  <OutlinedInput  sx={{height:45}} inputRef={messageInputRef} placeholder='message' endAdornment={
                  <IconButton type='submit'>
                      <SendSharp/>
                  </IconButton>
                  } />
              </FormControl>
            </form>
            
          </Box>
        </Box>
    
    </Slide>

  )
}
