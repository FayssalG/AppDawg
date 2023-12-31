import React, { useEffect, useRef, useState } from 'react'

import {IconButton ,Box,Avatar,ListItem,ListItemAvatar,ListItemText,Typography, Divider, Popper,   Slide, Paper, ClickAwayListener , MenuList, MenuItem, Grow } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useDiscussions } from '../../../../providers/DiscussionsProvider'
import { useOtherUsers } from '../../../../providers/OtherUsersProvider';

import DeleteDiscussionDialog from '../../disscussion/DeleteDiscussionDialog';

export default function OneDiscussion({active ,discussionId ,recipient , latestMsg}) {
  const {openOldDiscussion , deleteDiscussion} = useDiscussions()
  //getting profile photo of the other user
  const {getOtherUserDetails} = useOtherUsers()
  const [photoURL , setPhotoURL] = useState()
  useEffect(()=>{
      getOtherUserDetails(recipient.id)
      .then((data)=>{
          console.log({data})
          setPhotoURL(data.photoURL)
      }) 
  },[recipient])
  ////////////////////

  function handleOpenDiscussion(e){
    openOldDiscussion(recipient )
  }
  //hover event handling
  const [hover , setHover] = useState(false)

  function handleMouseEnter(e){
    setHover(true)
  }
  function handleMouseLeave(e){
    setHover(false)
  }
  
  const [open , setOpen] = useState(false)
  const anchorRef = useRef(null)

  function handleToggle(e){
    e.stopPropagation()
    
    setOpen((prev)=>!prev)
  }
 
  function handleClose(e){
    if (anchorRef.current && anchorRef.current.contains(e.target)) {
      return;
    }
    setOpen(false)
  }



  //discussion manage logic (delete discussion, mark messages as read , pin a discussion ... )
  const [openDeleteDialog , setOpenDeleteDialog] = useState(false)
  
  function handleOpenDeleteDialog(){
    setOpenDeleteDialog(true)
  }
  
  function handleCloseDeleteDialog(){
    setOpenDeleteDialog(false)
  }


    
  
  return (
    <>
      <Box  borderRadius={'10px'} backgroundColor={active || hover ? '#2A3942' : ''}  onClick={handleOpenDiscussion} sx={{ cursor:'pointer'}}>

        <ListItem 
          onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}
          sx={{px:1 , height:65 , overflow:'hidden'}}
          secondaryAction={
              <Box ref={anchorRef} >
                  <Slide direction='left'  in={hover}>
                      <IconButton  onClick={handleToggle} >
                        <ExpandMoreIcon/>
                      </IconButton>
                  </Slide> 
              </Box>      
          }
        >
        
          <ListItemAvatar >
              <Avatar sx={{mr:2,width:50 , height:50}} src={photoURL}/>
          </ListItemAvatar>
        
          <ListItemText primary={
              <>
                  <Typography  >{recipient.name}</Typography>
                  <Typography variant='caption' color='grey'>{latestMsg}</Typography>
              </>
              } 
          />
            <Divider sx={{position:'absolute' , bottom:0 , right:5 , width:'85%' }}/>
        </ListItem>
      
      </Box>

      {/* Drop menu */}
      <Popper  open={open} anchorOrigin={{vertical:'bottom' , horizontal:'right'}} anchorEl={anchorRef.current}>
        <Grow in={open}>
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
                <MenuList sx={{width:140 , py:0}} >
                  <MenuItem onClick={handleOpenDeleteDialog}>Delete</MenuItem>
                </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      </Popper>
            
      <DeleteDiscussionDialog discussionId={discussionId} open={openDeleteDialog} onClose={handleCloseDeleteDialog} />
    </>


  )
}
