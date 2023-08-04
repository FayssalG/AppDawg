import React, { useCallback, useRef, useState } from 'react'
import Message from './Message'
import TopbarDiscussion from './TopbarDiscussion';
import { useAuth } from '../../../providers/AuthProvider'
import { useDiscussions } from '../../../providers/DiscussionsProvider'
import { useUser } from '../../../providers/UserProvider';
import { useContacts } from '../../../providers/ContactsProvider';


import { SendSharp  } from '@mui/icons-material'
import { Box ,  FormControl , OutlinedInput , IconButton  , useMediaQuery , useTheme} from '@mui/material'
import DesktopView from './DesktopView';
import MobileView from './MobileView';

export default function OpenDiscussion() {
  const theme= useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'))
  
  const {userData , id} = useUser()
  const {addMessageToDiscussion , discussions,activeDiscussion} = useDiscussions()
  const {contacts , addContact} = useContacts()
  const messageInputRef = useRef(null)

  const setRef = useCallback((element)=>{
    if(element) element.scrollIntoView({smooth:true})
  },[])


  if(!activeDiscussion) return



  function handleMessageSend(e){
    e.preventDefault()    
    let messageContent = messageInputRef.current.value
    if(messageContent == '') return
    addMessageToDiscussion(activeDiscussion.discussionId ,  activeDiscussion.recipient ,  {senderId:id,senderName:userData.displayName , content:messageContent })
    messageInputRef.current.value = ''
  }
  
  const messages = activeDiscussion.messages
  const contact = contacts.find((contact)=>{
    return contact.id == activeDiscussion.recipient.id
  })

  return (
    <>
      { matches ?
          <DesktopView 
                id={id}
                messageInputRef={messageInputRef}
                handleMessageSend={handleMessageSend} 
                activeDiscussion={activeDiscussion}  
                messages={messages}
                contact={contact}
                />
          :
            <MobileView
                id={id}
                messageInputRef={messageInputRef}
                handleMessageSend={handleMessageSend} 
                activeDiscussion={activeDiscussion}  
                messages={messages}
                contact={contact}
            />
      }

    </>
    )
}
