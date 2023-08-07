import React, { useState , useRef , useCallback} from 'react'
import Message from './Message'
import TopbarDiscussion from './TopbarDiscussion';


import { SendSharp  } from '@mui/icons-material'
import { Box ,  FormControl , OutlinedInput , IconButton , Paper, Typography, Button } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BlockIcon from '@mui/icons-material/Block';


export default function DesktopView({messageInputRef , handleMessageSend , id ,messages ,contact, activeDiscussion , handleOpenDialog }) {
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
         
        <Box  overflow='auto' px={2} py={2} display='flex' flexDirection='column'  gap={2}>
        {
            messages.map((msg , index)=>{
            const lastRef = messages.length - 1 === index
            return  <Message key={index} messageRef={lastRef ? setRef : null}  userId={id} message={msg}/>
            })
        }
            

        </Box>


        <Box
            borderRadius='10px'
            backgroundColor='primary.dark'  
            padding={1.5} 
            width='100%' 
            marginTop='auto' >

            {/* Message to show if id does not exist in contacts */
                !contact  ?
                <Box   width='100%' mb={4}>
                    <Paper  sx={{ display:'flex' , alignItems:'center',flexDirection:'column' ,mx:'auto',maxWidth:400 , p:2}}>
                        <Typography mb={2} variant='body1' textAlign='center' fontSize={14} color='grey'>This ID does not exist in your contacts</Typography>
                        <Box>
                            <Button  startIcon={<BlockIcon/>} sx={{mr:2}}>
                                <Typography variant='button' color='success'>Block</Typography>
                            </Button>
                            <Button onClick={handleOpenDialog} startIcon={<PersonAddIcon/>} color='success'>
                                <Typography variant='button' >Add to Contacts</Typography>               
                            </Button>
                        </Box>
                        
                    </Paper>
                </Box>
                : null    
            /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */
            }

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

