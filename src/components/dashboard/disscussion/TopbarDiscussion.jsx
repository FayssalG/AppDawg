import React from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ArrowBack } from '@mui/icons-material'

import {Paper , Box , Avatar , IconButton , AppBar , Toolbar , Typography} from '@mui/material'

export default function TopbarDiscussion({showDiscussion , onShowDiscussion ,recipients}) {
  return (
    <Box 
      
      sx={{ borderColor:'primary.main' , height:70 , boxShadow:0 , backgroundColor:'topbar.main'}} 
      position='static' 
    >
    <Toolbar display='flex' sx={{py:1,alignItems:'center'}}>
        { 
          showDiscussion ?
          <Box> 
            <IconButton onClick={()=>onShowDiscussion(false)}>
              <ArrowBack/>
            </IconButton>
          </Box> 
          : null
        }
       
        <Box>
          <IconButton>
            <Avatar />
          </IconButton>
        </Box>
        
        <Box ml={1} mt={1}>
          <Typography variant='body1' lineHeight={.9} fontSize={19}>{recipients[0].id}</Typography>
          <Typography variant='caption' color='primary.light'>Online</Typography>
        </Box>            

        <Box ml='auto' >
          <IconButton >
            <MoreVertIcon/>            
          </IconButton>
        </Box>
      
    </Toolbar>      
  
  </Box>

  )
}
