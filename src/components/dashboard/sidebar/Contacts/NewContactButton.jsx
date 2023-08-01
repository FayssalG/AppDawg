import {Avatar, Divider , ListItem , ListItemAvatar , ListItemText, Typography , Box} from '@mui/material'
import React from 'react'

export default function OneContact({onClick  , children}) {
  return (
    <Box onClick={onClick} sx={{cursor:'pointer', ':hover' :{
        backgroundColor: '#2A3942',
    }}}>
        <ListItem sx={{px:1 , height:'80px'}}>
            <ListItemAvatar >
                <Avatar sx={{mr:2,width:50 , height:50 }}  />
            </ListItemAvatar>
                    
            <ListItemText  sx={{py:4,borderBottom:'solid 1px #2A3942'}} primary={
                <Box >
                    <Typography  >{children}</Typography>
                    <Typography  variant='caption' color='grey'></Typography>
                </Box>
                } 
            >

            </ListItemText>
        </ListItem>
    </Box>
  )
}
