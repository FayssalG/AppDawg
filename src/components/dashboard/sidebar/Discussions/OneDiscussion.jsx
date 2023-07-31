import React, { useEffect, useRef, useState } from 'react'
import {Box,Avatar,ListItem,ListItemAvatar,ListItemText,Typography} from '@mui/material'
import { useDiscussions } from '../../../../providers/DiscussionsProvider'
export default function OneDiscussion({active , recipients , latestMsg}) {
  const {openOldDiscussion} = useDiscussions()
  
  function handleOpenDiscussion(e){
    openOldDiscussion([recipients] )
  }

  return (
    <Box  backgroundColor={active ? '#2A3942' : ''}  onClick={handleOpenDiscussion} sx={{cursor:'pointer', ':hover' :{
      backgroundColor: '#2A3942',
    }}}>
      <ListItem sx={{px:1 , height:'80px'}}>
        <ListItemAvatar >
            <Avatar sx={{mr:2,width:60 , height:60}} />
        </ListItemAvatar>
            
        <ListItemText sx={{py:2,borderBottom:'solid 1px #2A3942'}}   primary={
            < >
                <Typography  >{recipients.name}</Typography>
                <Typography variant='caption' color='grey'>{latestMsg}</Typography>
            </>
            } 
          >

          </ListItemText>
      </ListItem>
    </Box>
    

  )
}
