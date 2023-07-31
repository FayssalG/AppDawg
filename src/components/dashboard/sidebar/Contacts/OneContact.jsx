import {Avatar, Divider , ListItem , ListItemAvatar , ListItemText, Typography , Box} from '@mui/material'
import React from 'react'
import { useDiscussions } from '../../../../providers/DiscussionsProvider'

export default function OneContact({onShowContacts , contactName , contactId }) {
    const {openNewDiscussion } = useDiscussions()

    function handleOpenDiscussion(){
        openNewDiscussion([{id:contactId , name:contactName }])
        onShowContacts(false)
    }

    return (
    <Box onClick={handleOpenDiscussion} sx={{cursor:'pointer', ':hover' :{
        backgroundColor: '#2A3942',
    }}}>
        <ListItem sx={{px:1 , height:'80px'}}>
            <ListItemAvatar >
                <Avatar sx={{mr:2,width:60 , height:60 }}  />
            </ListItemAvatar>
                    
            <ListItemText sx={{py:2,borderTop:'solid 1px #2A3942'}} primary={
                <Box >
                    <Typography  >{contactName}</Typography>
                    <Typography  variant='caption' color='grey'></Typography>
                </Box>
                } 
            >

            </ListItemText>
        </ListItem>
    </Box>
  )
}
