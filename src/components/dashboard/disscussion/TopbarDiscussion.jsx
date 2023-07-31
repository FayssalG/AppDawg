import React from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ArrowBack } from '@mui/icons-material'

import {Box , Avatar , IconButton , AppBar , Toolbar , Typography} from '@mui/material'

export default function TopbarDiscussion({recipients}) {
  return (
    <AppBar sx={{height:70}} position='static'>
    <Toolbar display='flex' sx={{alignItems:'center'}}>
        {/* <Box> 
          <IconButton>
            <ArrowBack/>
          </IconButton>
        </Box> */}
        <Box>
          <IconButton>
            <Avatar />
          </IconButton>
        </Box>
        
        <Box ml={1} mt={1}>
          <Typography variant='body1' lineHeight={.9}>{recipients[0].id}</Typography>
          <Typography variant='caption' color='grey'>Online</Typography>
        </Box>            

        <Box ml='auto' >
          <IconButton >
            <MoreVertIcon/>            
          </IconButton>
        </Box>
      
    </Toolbar>      
  
  </AppBar>

  )
}
