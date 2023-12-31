import React , {useCallback, useEffect, useMemo , useState} from 'react'



import { AppBar , Box , Typography , IconButton , Button , Paper , Avatar} from '@mui/material'
import BlockIcon  from '@mui/icons-material/Block'
import DeleteIcon from '@mui/icons-material/DeleteSharp'
import CloseIcon from '@mui/icons-material/CloseSharp'
import { useOtherUsers } from '../../../providers/OtherUsersProvider'

export default function ContactInfos({recipientDetails ,handleHideContactInfos ,  onUnblock , isBlocked,handleOpenBlockDialog , handleOpenDeleteDialog }) {


    const photoURL = recipientDetails ? recipientDetails.photoURL : null
    const displayName = recipientDetails ? recipientDetails.displayName : null
    const infos = recipientDetails ? recipientDetails.infos : null
    const chatId = recipientDetails ? recipientDetails.chatId : null
    
  
  return (
    <>
        <AppBar sx={{height:70,borderRadius:'10px', backgroundColor:'topbar.main'}} position='static'>
            <Box display='flex' alignItems='center' height='100%' padding={1}>
                <IconButton onClick={handleHideContactInfos}>
                    <CloseIcon/>
                </IconButton>
                <Typography >Contact Infos</Typography>
            </Box>
        </AppBar>         

        <Box maxHeight={'85svh'} overflow={'auto'}  paddingTop={1} display='flex' alignItems='center' flexDirection='column' >
            <Paper sx={{width:'100%' , p:3.5 , mb:1 }}>
                <Avatar src={photoURL}  sx={{mb:2 , mx:'auto', width:170  , height:170 }}></Avatar>
                <Typography mb={.9} textAlign='center' fontSize={24}>{chatId}</Typography>
                <Typography textAlign='center' fontSize={16}  color='grey'>~{displayName}</Typography>
            </Paper>
            
            <Paper sx={{width:'100%' , px:4 , py:2 , mb:1}}>
                <Typography mb={1} fontSize={14} color='grey'>Infos</Typography>
                <Typography   fontSize={16}>{infos}</Typography>
            </Paper>
            
            <Paper sx={{width:'100%' , px:4 , py:2 }}>
                <Button onClick={()=>isBlocked ? onUnblock() : handleOpenBlockDialog() } startIcon={<BlockIcon/>} variant='text' sx={{px:2 }}>{isBlocked ? 'Unblock' : 'Block'} "{chatId}"</Button>
                <Button onClick={handleOpenDeleteDialog} startIcon={<DeleteIcon/>} variant='text' sx={{px:2}}>Delete the discussion</Button>
              
            </Paper>    
        </Box>
    </>
  )
}
