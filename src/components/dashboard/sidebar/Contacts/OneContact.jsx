
import React , {useState , useRef, useReducer, useEffect} from 'react'
import {Avatar, Divider , ListItem , ListItemAvatar , ListItemText, Typography , Box , Popper ,MenuList , MenuItem , ClickAwayListener ,  IconButton , Paper , Grow , Slide} from '@mui/material'
import { Button , Dialog , DialogActions, DialogContent , TextField, DialogTitle , DialogContentText} from '@mui/material'
import  ExpandMoreIcon  from '@mui/icons-material/ExpandMore'


import { useDiscussions } from '../../../../providers/DiscussionsProvider'
import { useContacts } from '../../../../providers/ContactsProvider'
import RenameContactDialog from './RenameContactDialog'
import DeleteContactDialog from './DeleteContactDialog'
import { useOtherUsers } from '../../../../providers/OtherUsersProvider'



function dialogReducer(state , action ){
    switch(action.type){
        case 'add' : 
            return {...state , addDialog : action.payload}
            break;
        case 'rename' : 
            return {...state , renameDialog : action.payload}
            break;
        case 'delete' : 
            return {...state , deleteDialog : action.payload}
            break;
        default:
            return {...state}
    }
}

export default function OneContact({onShowContacts , contactDetails }) {
    //getting the photo of the contact
    const [photoURL , setPhotoURL] = useState()
    const {getOtherUserDetails} = useOtherUsers()
    const {name, id} = contactDetails 
    useEffect(()=>{
        getOtherUserDetails(contactDetails.id)
        .then((data)=>{
            console.log({data})
            setPhotoURL(data.photoURL)
        }) 
    },[contactDetails])
    //////////////////////////////////

    const {openNewDiscussion } = useDiscussions()
    const {deleteContact , renameContact} = useContacts()

    function handleOpenDiscussion(){
        openNewDiscussion({id:id , name:name } )
        onShowContacts(false)
    }


    //contact  logic management (delete  , rename  ... )
        //hover and drop menu logic
            const [hover , setHover] = useState(false)

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
        ////////////////////////////////

    const [openDialog , dispatch] = useReducer(dialogReducer , {deleteDialog:false , renameDialog:false, addDialog:false})
    console.log(openDialog)

    function handleOpenRenameDialog(){
        dispatch({type:'rename' , payload : true})
    }
    function handleCloseRenameDialog(){
        dispatch({type:'rename' , payload : false})
    }

    function handleOpenDeleteDialog(){
        dispatch({type:'delete' , payload : true})
    }
    function handleCloseDeleteDialog(){
        dispatch({type:'delete' , payload : false})
    }
    ///////////////////////////

return (
<>

    <Box sx={{borderRadius:'10px',cursor:'pointer'}} backgroundColor={hover ? '#2A3942' : ''}  onClick={handleOpenDiscussion} onMouseLeave={()=>setHover(false)} onMouseEnter={()=>setHover(true)} >
        <ListItem 
            sx={{px:1 , height:'80px' , overflow:'hidden'}}
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
                <Avatar sx={{mr:2,width:50 , height:50 }} src={photoURL} />
            </ListItemAvatar>
                    
            <ListItemText sx={{py:2,borderTop:'solid 1px #2A3942'}} primary={
                <Box >
                    <Typography  >{name}</Typography>
                    <Typography  variant='caption' color='grey'></Typography>
                </Box>
                } 
            >

            </ListItemText>
        </ListItem>
    </Box>

    {/* Drop menu */}
        <Popper sx={{zIndex:2}} open={open} anchorOrigin={{vertical:'bottom' , horizontal:'right'}}  anchorEl={anchorRef.current}>
            <Grow in={open}>
            <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                    <MenuList sx={{width:140 , py:0}} >
                        <MenuItem onClick={handleOpenRenameDialog}>Rename</MenuItem>
                        <MenuItem onClick={handleOpenDeleteDialog}>Delete</MenuItem>
                    </MenuList>
                </ClickAwayListener>
            </Paper>
            </Grow>
        </Popper>
    {/*  */}

    {/* Delete dialog */}
        <DeleteContactDialog open={openDialog.deleteDialog} onClose={handleCloseDeleteDialog} contactDetails={contactDetails}/>
    {/*  */}
    {/* Rename dialog */}
        <RenameContactDialog  open={openDialog.renameDialog} onClose={handleCloseRenameDialog} contactDetails={contactDetails}/>
    {/*  */}
</>
  )
}
