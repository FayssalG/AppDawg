import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import Message from './Message'
import TopbarDiscussion from './TopbarDiscussion';
import { useAuth } from '../../../providers/AuthProvider'
import { useDiscussions } from '../../../providers/DiscussionsProvider'
import { useUser } from '../../../providers/UserProvider';
import { useContacts } from '../../../providers/ContactsProvider';
import { useOtherUsers } from '../../../providers/OtherUsersProvider';

import { CloseSharp, SendSharp  } from '@mui/icons-material'
import {Typography ,Box ,Button ,  FormControl , OutlinedInput , IconButton  , useMediaQuery , useTheme, AppBar, Avatar, Paper} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BlockIcon from '@mui/icons-material/Block';
import AttachFileIcon from '@mui/icons-material/AttachFile';


import AddToContactsDialog from './AddToContactsDialog'
import DeleteDiscussionDialog from './DeleteDiscussionDialog';
import BlockUserDialog from './BlockUserDialog';
import ContactInfos from './ContactInfos';
import { MuiFileInput } from 'mui-file-input';


//Helper function
function dialogReducer(state , action){
  switch(action.type){
    case 'add-contact' :
      return {...state , addContactDialog : action.payload}
    case 'block' : 
      return {...state ,  blockDialog : action.payload}
    case 'delete':
      return {...state , deleteDialog:action.payload}
  }
}

export default function OpenDiscussion() {
  const theme= useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'))
  
  const {userData , id , updateBlockedUsers} = useUser()
  const {addMessageToDiscussion ,activeDiscussion , checkIfUserBlocked , }  = useDiscussions()
  
  const {contacts , addContact} = useContacts()
  
  const messageInputRef = useRef(null)
  const [attachmentPreview , setAttachmentPreview] = useState(null)

  const setRef = useCallback((element)=>{
    if(element) element.scrollIntoView({smooth:true})
  },[])

  //function handling adding a contact to constacts if it does not exist
  const {showDiscussion , setShowDiscussion} =useDiscussions()

  const [openDialog , dispatch] = useReducer(dialogReducer , {addContactDialog:false , blockDialog:false , deleteDialog:false}) 
  
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
  const [isBlocked , setIsBlocked] =useState()
  useEffect(()=>{
    if(!activeDiscussion) return
    checkIfUserBlocked(activeDiscussion.recipient.id , id)
    .then((result)=>setIsBlocked(result))
  },[activeDiscussion])

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
 
  //handle showing contact infos
   const [showContactInfos , setShowContactInfos]= useState(false)
   function handleShowContactInfos(){
      setShowContactInfos(true)
   }
   function handleHideContactInfos(){
      setShowContactInfos(false)
   }

  ///////////////
  
  //handle Deleting the discussion
  function handleOpenDeleteDialog(){
    dispatch({type:'delete' , payload:true})
  }
  function handleCloseDeleteDialog(){
    dispatch({type:'delete' , payload:false})
  }



/////////////////////////////
//getting the recipient's data
  const {getOtherUserDetails} = useOtherUsers()
  const [recipientDetails , setRecipientDetails] = useState()

  const getRecipientDetails = useCallback(async ()=>{
    if(!activeDiscussion) return
    return await getOtherUserDetails(activeDiscussion.recipient.id)
  },[activeDiscussion])

  useEffect(()=>{
      getRecipientDetails()
      .then((data)=>{
          if(data) setRecipientDetails(data)
          console.log(data)
      })
      
  },[getRecipientDetails])

/////////////////////////////

  if(!activeDiscussion) return
  function convertBlobToDataUrl(blob){
    const promise = new Promise((resolve , reject)=>{
      if(!blob) reject(null)
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = ()=>{
        resolve(reader.result)
      }
    })
    return promise
  }
  async function handleMessageSend(e){
    e.preventDefault()    
    let messageContent = messageInputRef.current.value
    if(messageContent == '' && attachmentPreview == null) return
    const senderId = id
    const senderName = userData.displayName
    const content = messageContent
    
    const attachment = await convertBlobToDataUrl(attachmentPreview)

    const messageId = Date.now().toString()
    const time = new Date().toLocaleTimeString('en-gb' , {hour:'numeric' , minute:'numeric'}) 

    
    addMessageToDiscussion(activeDiscussion.discussionId ,  activeDiscussion.recipient , 
      {senderId , senderName , content , attachment , messageId , time})
   
    messageInputRef.current.value = ''
    setAttachmentPreview(null)
  }  

  const messages = activeDiscussion.messages
  const contact = contacts.find((contact)=>{
    return contact.id == activeDiscussion.recipient.id
  })


  
  return (
    <Box display='flex' flexDirection='row' >
       <Box     
            flexGrow={1}
            sx={
                matches ? {position:'relative' , height:'94vh'} : 
                {
                    padding:2,
                    position:'fixed', 
                    top:0 , left:0 , width:'100%' ,  
                    backgroundColor:'primary.dark',height:'95vh' , px:1,
                    translate:showDiscussion ?  0 : '100%',
                    transition:'translate ease 200ms'
                }
            }
            display='flex'
            flexDirection='column'  
        >

            <TopbarDiscussion recipientDetails={recipientDetails} recipient={activeDiscussion.recipient} showContactInfos={showContactInfos} handleShowContactInfos={handleShowContactInfos} showDiscussion={matches ? null : showDiscussion} onShowDiscussion={matches ? null : setShowDiscussion}  handleOpenDeleteDialog={handleOpenDeleteDialog} handleOpenBlockDialog={handleOpenBlockDialog} />
                    
            {/* Message to show if id does not exist in contacts */
            !contact   ?
            <Box   width='100%' mt={1}>
                <Box  sx={{opacity:.8 ,display:'flex' , alignItems:'center', gap:5, justifyContent:'center' ,mx:'auto',width:'100%' , p:1}}>
                    {/* <Typography  variant='body1' textAlign='center' fontSize={14} color='grey'>This ID does not exist in your contacts</Typography> */}
                    <Box>
                        <Button onClick={isBlocked ? handleUnblockUser  : handleOpenBlockDialog}  startIcon={<BlockIcon/>} sx={{mr:2}}>
                            <Typography variant='button' color='success'>{isBlocked ? 'Unblock' : 'Block'}</Typography>
                        </Button>
                        <Button onClick={handleOpenAddContactDialog} startIcon={<PersonAddIcon/>} color='success'>
                            <Typography variant='button' >Add to Contacts</Typography>               
                        </Button>
                    </Box>
                    
                </Box>
            </Box>
            : null    
            /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
            }

            <Box  overflow='auto' px={2} py={2} display='flex' flexDirection='column'  gap={2}>
              {
                messages.map((msg , index)=>{
                const lastRef = messages.length - 1 === index
                return  <Message key={msg.messageId} messageRef={lastRef ? setRef : null}  userId={id} message={msg}/>
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
                        {
                          attachmentPreview &&
                          <Box position='relative' width='400px' height='200px' boxShadow='0 0 1px' p={1} mb={1}>
                            <IconButton onClick={()=>setAttachmentPreview(null)} sx={{position:'absolute' , right:0 , top:0}}>
                              <CloseSharp/>
                            </IconButton>
                            <img style={{height:'100%' , objectFit:'contain'}} src={URL.createObjectURL(attachmentPreview)} alt="" />
                          </Box> 
                        }

                        <OutlinedInput  sx={{height:45,  }} inputRef={messageInputRef} placeholder='message' endAdornment={
                          <>
                            <IconButton type='submit'>
                                <SendSharp/>
                            </IconButton>
                            <IconButton>  
                                  <input type="file" onChange={(e)=>setAttachmentPreview(e.target.files[0])} style={{position : 'absolute' , width:0 , height:0 , opacity:0, padding:'50%'}} />
                                  <AttachFileIcon/>
                            </IconButton>
                          </>                                                  
                        } />
                    </FormControl>
                </form>            
            </Box>
            
        </Box>


        {matches ? 
          <Box  width={400} paddingLeft={2}
              sx={showContactInfos ? {translate:'0' , transition:'translate 200ms ease'} 
              :{transition:'translate 200ms ease' ,translate:'400px' ,position:'fixed',right:0 }}
          >
              <ContactInfos recipientDetails={recipientDetails} recipientId={activeDiscussion.recipient.id} handleOpenDeleteDialog={handleOpenDeleteDialog} handleOpenBlockDialog={handleOpenBlockDialog} handleHideContactInfos={handleHideContactInfos}/>
          </Box>
          :
          <Box width='100%' height='100%' position='fixed' padding={2} backgroundColor='primary.dark' top={0}  right={0}
              sx={showContactInfos ? {transition:'translate 200ms ease' , translate:'0'  } 
              :{transition:'translate 200ms ease' ,translate:'100%' }}
          >
              <ContactInfos recipientDetails={recipientDetails} recipientId={activeDiscussion.recipient.id} handleOpenDeleteDialog={handleOpenDeleteDialog} handleOpenBlockDialog={handleOpenBlockDialog} handleHideContactInfos={handleHideContactInfos}/>
          </Box>  
        }


      <AddToContactsDialog open={openDialog.addContactDialog} onClose={handleCloseAddContactDialog} contactId={activeDiscussion.recipient.id} onAddContact={handleAddContactIfNotExist}/>  
      <BlockUserDialog open={openDialog.blockDialog} onClose={handleCloseBlockDialog}  onBlock={handleBlockUser}/>                    
      <DeleteDiscussionDialog discussionId={activeDiscussion.discussionId} open={openDialog.deleteDialog} onClose={handleCloseDeleteDialog} />
    </Box>
    )
}
