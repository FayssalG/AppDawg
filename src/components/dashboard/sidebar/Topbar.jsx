
import React , {useState} from 'react'
import MessageIcon from '@mui/icons-material/Message';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import {Toolbar as ToolbarMui , Box , Typography , Avatar , Menu ,MenuItem , IconButton , AppBar} from '@mui/material'

export default function Topbar({signOut , userPhoto  , id , onShowProfil , onShowContacts}) {
    const [anchorElUser , setAnchorElUser] = useState(false)

    function handleOpenUserMenu(e){
        setAnchorElUser(e.currentTarget)
    }
    function handleCloseUserMenu(){
        setAnchorElUser(false)
    }

  return (
    <AppBar sx={{maxHeight:70}} position='static' >
              
        <Box sx={{p:1}}>        
            <Box  display='flex' alignItems='center' justifyContent='space-between'>
                <Box>
                    <IconButton  onClick={()=>onShowProfil(true)} >
                        <Avatar src={userPhoto}></Avatar>
                    </IconButton>                
                </Box>    
                <Box>
                    <IconButton onClick={()=>onShowContacts(true)}>
                        <MessageIcon/>
                    </IconButton>    
                    <IconButton onClick={handleOpenUserMenu}>
                        <MoreVertIcon/>                    
                    </IconButton>            
                </Box>
            </Box>
    
            <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                {/* <MenuItem onClick={()=>{handleCloseUserMenu()}}>Profil</MenuItem> */}
                <MenuItem onClick={signOut}>Log out</MenuItem>
            </Menu>


        </Box>
    </AppBar>
  )
}
