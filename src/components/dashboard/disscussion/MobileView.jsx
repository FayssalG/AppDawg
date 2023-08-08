import React, { useCallback, useEffect, useRef, useState } from 'react'
import Message from './Message'
import TopbarDiscussion from './TopbarDiscussion';

import { SendSharp  } from '@mui/icons-material'

import {Slide , Box ,  FormControl , OutlinedInput , IconButton, Typography , Button , Paper} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BlockIcon from '@mui/icons-material/Block';


import { useAuth } from '../../../providers/AuthProvider'
import { useDiscussions } from '../../../providers/DiscussionsProvider'
import { useUser } from '../../../providers/UserProvider';

export default function MobileView({  messageInputRef , handleMessageSend , id ,contact , messages , activeDiscussion , handleOpenDialog , handleOpenBlockDialog , handleUnblockUser , isBlocked}) {

  const {showDiscussion , setShowDiscussion} =useDiscussions()
  
  const setRef = useCallback((element)=>{
    if(element) element.scrollIntoView({smooth:true})
  },[])
  



  return (
    <Slide sx={{position:'fixed' , top:0 , right:0,width:'100%'}} direction='left' in={showDiscussion} unmountOnExit mountOnEnter>

        <Box 
          position='relative'
          height='98vh' 
          padding={2} 
          backgroundColor='primary.dark'
          boxShadow='-.2px 0 0 grey' 
          display='flex' 
          flexDirection='column'  
          >
        
        <TopbarDiscussion showDiscussion={showDiscussion} onShowDiscussion={setShowDiscussion} recipient={activeDiscussion.recipient}/>
        
           {/* Message to show if id does not exist in contacts */
            !contact  ?
            <Box   width='100%' mt={1}>
                <Box  sx={{opacity:.8 ,display:'flex' , alignItems:'center', gap:5, justifyContent:'center' ,mx:'auto',width:'100%' , p:1}}>
                    {/* <Typography  variant='body1' textAlign='center' fontSize={14} color='grey'>This ID does not exist in your contacts</Typography> */}
                    <Box>
                        <Button onClick={isBlocked ? handleUnblockUser  : handleOpenBlockDialog}  startIcon={<BlockIcon/>} sx={{mr:2}}>
                            <Typography variant='button' color='success'>Block</Typography>
                        </Button>
                        <Button onClick={handleOpenDialog} startIcon={<PersonAddIcon/>} color='success'>
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
                return  <Message key={msg.messageId} messageRef={lastRef ? setRef : null}  message={msg} userId={id} />
            })
            }
        
        </Box>



        <Box
            backgroundColor='primary.dark'  
            padding={1.5} 
            width='100%' 
            marginTop='auto' 
        >
             
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
