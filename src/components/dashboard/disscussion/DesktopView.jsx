import React, { useState , useRef , useCallback} from 'react'
import Message from './Message'
import TopbarDiscussion from './TopbarDiscussion';


import { SendSharp  } from '@mui/icons-material'
import { Box ,  FormControl , OutlinedInput , IconButton , Paper, Typography, Button } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BlockIcon from '@mui/icons-material/Block';


export default function DesktopView({messageInputRef , handleMessageSend , id ,messages ,contact, activeDiscussion , handleOpenDialog , handleOpenBlockDialog , handleUnblockUser , isBlocked}) {
    const setRef = useCallback((element)=>{
        if(element) element.scrollIntoView({smooth:true})
      },[])
    
      console.log(contact)
return (
    <Box     
        //boxShadow='-.2px 0 0 grey'
        height='94vh' 
        display='flex' 
        flexDirection='column'  
        position='relative'>
        
        <TopbarDiscussion recipient={activeDiscussion.recipient} />
         
         
        {/* Message to show if id does not exist in contacts */
            !contact  ?
            <Box   width='100%' mt={1}>
                <Box  sx={{opacity:.8 ,display:'flex' , alignItems:'center', gap:5, justifyContent:'center' ,mx:'auto',width:'100%' , p:1}}>
                    <Typography  variant='body1' textAlign='center' fontSize={14} color='grey'>This ID does not exist in your contacts</Typography>
                    <Box>
                        <Button onClick={isBlocked ? handleUnblockUser  : handleOpenBlockDialog}  startIcon={<BlockIcon/>} sx={{mr:2}}>
                            <Typography variant='button' color='success'>{isBlocked ? 'Unblock' : 'Block'}</Typography>
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

