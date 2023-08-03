
import React , {useState} from 'react'

import {Avatar, Divider , ListItem , ListItemAvatar , ListItemText, Typography , Box} from '@mui/material'
import { useDiscussions } from '../../../../providers/DiscussionsProvider'

export default function OneContact({onShowContacts , contactDetails }) {
    const {name, id , photoURL} = contactDetails 
    const {openNewDiscussion } = useDiscussions()
   
    function handleOpenDiscussion(){
        openNewDiscussion({id:id , name:name } )
        onShowContacts(false)
    }

    const [hover , setHover] = useState(false)


    return (
    <Box sx={{borderRadius:'10px',cursor:'pointer'}} backgroundColor={hover ? '#2A3942' : ''}  onClick={handleOpenDiscussion} onMouseLeave={()=>setHover(false)} onMouseEnter={()=>setHover(true)} >
        <ListItem sx={{px:1 , height:'80px'}}>
            <ListItemAvatar >
                <Avatar sx={{mr:2,width:50 , height:50 }}  />
            </ListItemAvatar>
                    
            <ListItemText sx={{py:2,borderTop:'solid 1px #2A3942'}} primary={
                <Box >
                    <Typography  >{name}</Typography>
                    <Typography  variant='caption' color='grey'></Typography>
                </Box>
                } 
            >

            </ListItemText>
        </ListItem>
    </Box>
  )
}
