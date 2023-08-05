import React, { useReducer, useRef, useState } from 'react'

import EditSharpIcon from '@mui/icons-material/EditSharp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DoneIcon from '@mui/icons-material/Done';
import {Slide , Box , Avatar , IconButton , Badge , TextField, Typography , AppBar, FormControl, Input , InputLabel , InputAdornment} from '@mui/material'
import { useAuth } from '../../../providers/AuthProvider';
import { useUser } from '../../../providers/UserProvider';




export default function Profil({  onShowProfil , showProfil }) {
  const {updateDisplayName , updatePhotoURL , updateInfos , dispatch , userData} = useUser()
  const {photoURL , displayName , infos} = userData

  const displayNameRef = useRef(null)
  const infosRef = useRef(null)
  const photoRef = useRef(null)

  
  function handleUpdatePhoto(){
    let file = photoRef.current.files[0]
    updatePhotoURL(file)
    dispatch({type:'photourl' , payload:URL.createObjectURL(file)})  
  }

  function handleUpdateDisplayName(){
    setShowNameInput(false)    
    updateDisplayName(displayNameRef.current.value)
    dispatch({type:'displayname' , payload:displayNameRef.current.value})
  }

  
  function handleUpdateInfos(){
    setShowInfosInput(false)
    updateInfos(infosRef.current.value)
    dispatch({type:'infos' , payload:infosRef.current.value})
  }

  const [showNameInput , setShowNameInput] = useState(false)
  const [showInfosInput , setShowInfosInput] = useState(false)
  
  return (
    <Slide direction='right' in={showProfil} mountOnEnter unmountOnExit>
        <Box 
          backgroundColor='primary.dark' 
          sx={{position:'absolute',zIndex:2, width:'100%', left:0,top:0  }}>

            <AppBar sx={{borderRadius:'10px', backgroundColor:'topbar.main'}} position='static' >
              <Box sx={{display:'flex' ,gap:4 , p:'4rem 0 1rem 1rem', alignItems:'center'}}>
                <IconButton onClick={()=>onShowProfil(false)}>
                  <ArrowBackIcon sx={{cursor:'pointer'}}  />
                </IconButton>
                <Typography variant='p' fontWeight='bold' fontSize='1.1rem'>Profil</Typography>
              </Box>
            </AppBar>

            
            <Box sx={{overflow:'auto' ,maxHeight:'500px',display:'flex' , flexDirection : 'column' , alignItems: 'center' }}>
                <IconButton sx={{ mt:2}} component='label' >
                  <Badge 
                    anchorOrigin={{vertical : 'bottom' , horizontal:'right'}}
                    overlap='circular' 
                  >
                    <input ref={photoRef} onChange={handleUpdatePhoto}  hidden type='file'></input>
                  
                    <Avatar src={photoURL} sx={{width:170  , height:170 }} />
                  </Badge>
                </IconButton>

                  <Box padding={4}    display='flex' gap={5} flexDirection='column'>
                    <Box>
                      <Typography marginBottom={2} variant='body1' fontSize={14} color='primary' >Your Name</Typography>
                      
                      {
                        showNameInput ?
                        <FormControl sx={{width:'100%'}}>
                          <Input defaultValue={displayName} inputRef={displayNameRef} endAdornment={
                            <IconButton onClick={handleUpdateDisplayName}>
                              <DoneIcon/>
                            </IconButton>
                          }>
                          </Input>
                        </FormControl>
                        :
                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                          <Typography sx={{flexGrow:1}}>{displayName}</Typography>
                          <IconButton onClick={()=>setShowNameInput(true)} sx={{justifySelf:'end'}}>
                            <EditSharpIcon/>
                          </IconButton>
                        </Box> 
                      }
                      
                      <Typography  sx={{mt:2}} variant='body2' color='grey'  size={0.2} >Ce n'est pas votre nom d'utilisateur·ice ni votre code PIN. Ce nom sera visible par vos contacts WhatsApp.</Typography> 
                    </Box>

                    <Box>
                      <Typography marginBottom={2} variant='body1' fontSize={14} color='primary' >Infos</Typography>
                      
                      {
                        showInfosInput ?
                          <FormControl sx={{width:'100%'}}>
                            <Input defaultValue={infos} inputRef={infosRef} endAdornment={
                              <IconButton onClick={handleUpdateInfos}>
                                <DoneIcon/>
                              </IconButton>
                            }>
                            </Input>
                        </FormControl>       
                    
                        :
                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                          <Typography sx={{flexGrow:1}}>{infos}</Typography>
                          <IconButton onClick={()=>setShowInfosInput(true)} >
                            <EditSharpIcon/>
                          </IconButton>
                        </Box> 
                      }
                  
                    </Box>
                  </Box>
              </Box>
        
        </Box>
    </Slide>
      )
}
