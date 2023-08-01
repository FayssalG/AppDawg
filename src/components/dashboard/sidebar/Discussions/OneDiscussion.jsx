import React, { useEffect, useRef, useState } from 'react'

import {IconButton ,Box,Avatar,ListItem,ListItemAvatar,ListItemText,Typography, Divider,Menu, Popper, Stack , Slide, Paper, ClickAwayListener , MenuList, MenuItem} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useDiscussions } from '../../../../providers/DiscussionsProvider'

export default function OneDiscussion({active , recipients , latestMsg}) {
  const {openOldDiscussion} = useDiscussions()
  function handleOpenDiscussion(e){
    openOldDiscussion([recipients] )
  }


  const [hover , setHover] = useState(false)

  function handleMouseEnter(e){
    setHover(true)
  }
  function handleMouseLeave(e){
    setHover(false)
  }
  

  //discussion manage logic (delete discussion, mark messages as read , pin a discussion ... )
 
  const [open , setOpen] = useState(false)
  const anchorRef = useRef(null)

  function handleToggle(){
    setOpen((prev)=>!prev)
  }
 
  function handleClose(e){
    if (anchorRef.current && anchorRef.current.contains(e.target)) {
      return;
    }
    setOpen(false)
  }

  return (
    <Box   backgroundColor={active || hover ? '#2A3942' : ''}  onClick={handleOpenDiscussion} sx={{ cursor:'pointer'}}>

      <ListItem 
        onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}
        sx={{backposition:'relative',px:1 , height:65 , overflow:'hidden'}}
        secondaryAction={
            <Box ref={anchorRef} sx={{translate:10}}>
                <Slide direction='left' in={hover}>
                      <IconButton  onClick={handleToggle} >
                        <ExpandMoreIcon/>
                      </IconButton>
                    
                </Slide> 
            </Box>
           
          
        }
      >
      

        <ListItemAvatar >
            <Avatar sx={{mr:2,width:50 , height:50}} />
        </ListItemAvatar>
      
        <ListItemText primary={
            <>
                <Typography  >{recipients.name}</Typography>
                <Typography variant='caption' color='grey'>{latestMsg}</Typography>
            </>
            } 
         />
            
          <Divider sx={{position:'absolute' , bottom:0 , right:0 , width:'85%' }}/>
      
      </ListItem>

      {/* Drop menu */}
      <Menu  open={open} anchorOrigin={{vertical:'bottom' , horizontal:'left'}} anchorEl={anchorRef.current}>
        <ClickAwayListener onClickAway={handleClose}>
            <MenuList sx={{width:200 , py:0}} >
              <MenuItem >Delete</MenuItem>
            </MenuList>
        </ClickAwayListener>
      </Menu>

    </Box>
    



  )
}
