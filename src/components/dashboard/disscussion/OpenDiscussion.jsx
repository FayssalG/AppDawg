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
import AddToContactsDialog from './AddToContactsDialog'
import { useOtherUsers } from '../../../providers/OtherUsersProvider';

//Helper function
function generateId(len){
  const chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let id = ''
  for(let i=0 ; i<len ; i++){
    id += chars[Math.floor(Math.random()*chars.length)]
  }
  return id
}


export default function OpenDiscussion() {
  const theme= useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'))
  
  const {userData , id , updateBlockedUsers} = useUser()
  const {addMessageToDiscussion ,activeDiscussion }  = useDiscussions()
  const {contacts , addContact} = useContacts()
  
  const messageInputRef = useRef(null)

  const setRef = useCallback((element)=>{
    if(element) element.scrollIntoView({smooth:true})
  },[])

  //function handling adding a contact to constacts if it does not exist
  const [openDialog , setOpenDialog] = useState(false)  
  function handleCloseDialog(){
    setOpenDialog(false)
  }
  function handkeOpenDialog(){
    setOpenDialog(true)
    console.log(openDialog)
  }
  function handleAddContactIfNotExist(contactId , newName){
    setOpenDialog(false)
    addContact(contactId , newName)
  }
  /////////////////
  // handle blocking a user if it does not exist in contacts
  function handleBlockUser(){
     updateBlockedUsers(activeDiscussion.recipient.id)
  }


  ///////////////////////////
  if(!activeDiscussion) return

  function handleMessageSend(e){
    e.preventDefault()    
    let messageContent = messageInputRef.current.value
    if(messageContent == '') return
    const senderId = id
    const senderName = userData.displayName
    const content = messageContent
    const messageId = Date.now().toString()
    const time = new Date().toLocaleTimeString('en-gb' , {hour:'numeric' , minute:'numeric'}) 

    addMessageToDiscussion(activeDiscussion.discussionId ,  activeDiscussion.recipient , 
      {senderId , senderName , content , messageId , time})
   
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

                handleOpenDialog={handkeOpenDialog}
                handleBlockUser={handleBlockUser}
                />
          :
            <MobileView
                id={id}
                messageInputRef={messageInputRef}
                handleMessageSend={handleMessageSend} 
                activeDiscussion={activeDiscussion}  
                messages={messages}
                contact={contact}

                handkeOpenDialog={handkeOpenDialog}
                handleBlockUser={handleBlockUser}
            />
      }
      
      <AddToContactsDialog open={openDialog} onClose={handleCloseDialog} contactId={activeDiscussion.recipient.id} onAddContact={handleAddContactIfNotExist}/>  
    </>
    )
}
