import React, { useEffect, useRef, useState } from 'react'
import {Box,Avatar,ListItem,ListItemAvatar,ListItemText,Typography, Divider} from '@mui/material'
import { useDiscussions } from '../../../../providers/DiscussionsProvider'
export default function OneDiscussion({active , recipients , latestMsg}) {
  const {openOldDiscussion} = useDiscussions()
  
  function handleOpenDiscussion(e){
    openOldDiscussion([recipients] )
  }

  return (
    <Box  backgroundColor={active ? '#2A3942' : ''}  onClick={handleOpenDiscussion} sx={{ cursor:'pointer', ':hover' :{
      backgroundColor: '#2A3942',
    }}}>
      <ListItem sx={{position:'relative',px:1 , height:65}}>
        <ListItemAvatar >
            <Avatar sx={{mr:2,width:50 , height:50}} />
        </ListItemAvatar>
            
        <ListItemText primary={
            <>
                <Typography  >{recipients.name}</Typography>
                <Typography variant='caption' color='grey'>{latestMsg}</Typography>
            </>
            } 
          >
          </ListItemText>

          <Divider sx={{position:'absolute' , bottom:0 , right:0 , width:'85%' }}/>
      </ListItem>
    </Box>
    

  )
}
