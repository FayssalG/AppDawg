import React, { useCallback, useReducer, useRef, useState } from 'react'
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
import BlockUserDialog from './BlockUserDialog';

//Helper function
function generateId(len){
  const chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let id = ''
  for(let i=0 ; i<len ; i++){
    id += chars[Math.floor(Math.random()*chars.length)]
  }
  return id
}

function dialogReducer(state , action){
  switch(action.type){
    case 'add-contact' :
      return {...state , addContactDialog : action.payload}
    case 'block' : 
      return {...state ,  blockDialog : action.payload}
  }
}

export default function OpenDiscussion() {
  const theme= useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'))
  
  const {userData , id , updateBlockedUsers} = useUser()
  const {addMessageToDiscussion ,activeDiscussion , checkIfUserBlocked}  = useDiscussions()
  const {contacts , addContact} = useContacts()
  
  const messageInputRef = useRef(null)

  const setRef = useCallback((element)=>{
    if(element) element.scrollIntoView({smooth:true})
  },[])

  //function handling adding a contact to constacts if it does not exist
  const [openDialog , dispatch] = useReducer(dialogReducer , {addContactDialog:false , blockDialog:false}) 
  
  function handleCloseAddContactDialog(){
    dispatch({type:'add-contact' , payload: false})
  }
  function handleOpenAddContactDialog(){
    dispatch({type:'add-contact' , payload:true})
  }

  function handleAddContactIfNotExist(contactId , newName){
    dispatch({type:'add-contact' , payload:false})
    addContact(contactId , newName)
  }
  /////////////////
  
  // handle blocking a user if it does not exist in contacts
  const [isBlocked , setIsBlocked] =useState(()=> activeDiscussion ? checkIfUserBlocked(activeDiscussion.recipient.id , id) : false)
  function handleCloseBlockDialog(){
    dispatch({type:'block' , payload: false})
  }
  function handleOpenBlockDialog(){
    dispatch({type:'block' , payload:true})
  }

  function handleBlockUser(){
    dispatch({type:'block' , payload: false})
    setIsBlocked(true)
    updateBlockedUsers(activeDiscussion.recipient.id , 'block')
  }
  function handleUnblockUser(){
    dispatch({type:'block' , payload: false})
    setIsBlocked(false)
    updateBlockedUsers(activeDiscussion.recipient.id , 'unblock')
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

                handleOpenAddContactDialog={handleOpenAddContactDialog}
                handleOpenBlockDialog={handleOpenBlockDialog}
                
                handleUnblockUser={handleUnblockUser}
                isBlocked={isBlocked}
                />
          :
            <MobileView
                id={id}
                messageInputRef={messageInputRef}
                handleMessageSend={handleMessageSend} 
                activeDiscussion={activeDiscussion}  
                messages={messages}
                contact={contact}

                handleOpenAddContactDialog={handleOpenAddContactDialog}
                handleOpenBlockDialog={handleOpenBlockDialog}

                handleUnblockUser={handleUnblockUser}
                isBlocked={isBlocked}

              />
      }
      
      <AddToContactsDialog open={openDialog.addContactDialog} onClose={handleCloseAddContactDialog} contactId={activeDiscussion.recipient.id} onAddContact={handleAddContactIfNotExist}/>  
      <BlockUserDialog open={openDialog.blockDialog} onClose={handleCloseBlockDialog}  onBlock={handleBlockUser}/>
    </>
    )
}
