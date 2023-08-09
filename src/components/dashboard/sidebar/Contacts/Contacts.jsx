import React, { useMemo, useState } from 'react'
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Paper,Slide , Box , List, Typography , AppBar, Divider, Autocomplete, TextField, IconButton} from '@mui/material'

import OneContact from './OneContact';
import NewContactDialog from './NewContactDialog';
import NewContactButton from './NewContactButton';

import { useContacts } from '../../../../providers/ContactsProvider';
import {useDiscussions} from '../../../../providers/DiscussionsProvider'



export default function Contacts({onShowContacts , showContacts}) {
    const {contacts } = useContacts()

    const [open , setOpen] = useState(false)

    
    function handleOpen(){
        setOpen(true)
    }

    function handleClose(){
        setOpen(false)
    }


    //handle searching
    const [query , setQuery] = useState('')
    
    const filteredContacts = useMemo(()=>{
      return contacts.filter((contact)=>{
        if(query=='') return contact.name
        return contact.name.toLowerCase().includes(query.toLowerCase())
      })
    },[contacts , query])
    
    const alphabets = useMemo(()=>{
      let chars= filteredContacts.map((c)=>{
          return c.name[0].toUpperCase()
      })
      chars.sort()
      chars = chars.filter((item , index)=>{
          return chars.indexOf(item) === index
      })
      return chars 
    },[contacts , query])
 
    function handleSearch(e){
      setQuery(e.target.value)
    }

    return (
      <Slide direction="right" in={showContacts} mountOnEnter unmountOnExit>
        <Box
          backgroundColor='primary.dark'
          position= "absolute"
          zIndex= {2}
          height= "100%"
          width= "100%"
          pb= {4}
          left= {0}
          top= {0}
          display= "flex"
          flexDirection= "column"
          alignItems= "center"
        >
        
          <AppBar sx={{borderRadius:'10px', backgroundColor:'topbar.main' , mb:2}} position="static" >
            <Box sx={{display: "flex", gap: 4, p: "4rem 0 1rem 1rem", alignItems: "center" }}>
              
              <IconButton onClick={() => onShowContacts(false)}>
                <ArrowBackIcon sx={{ cursor: "pointer" }} />
              </IconButton>
              
              <Typography variant="p" fontWeight="bold" fontSize="1.1rem">
                New Discussion
              </Typography>
            </Box>
          </AppBar>
          
          <TextField sx={{ height:4 , width:'95%', mb:8 , mx:'auto' }} onChange={handleSearch} label="Search..." />    

          <Box sx={{ width: "100%", pt: 4 ,overflow: "auto" }}>  
              
            <Box mb={4}>
                <NewContactButton onClick={handleOpen}  >
                  NewContact
                </NewContactButton>
                <NewContactDialog  onClose={handleClose} open={open}/>
            </Box>

            <Typography mb={3} textTransform="uppercase" px={2} variant="h1" fontSize={19} color="primary">
              Your Contacts
            </Typography>
            <List>
              {
                alphabets.map((char , index) => {
                return (
                  <Box key={index} mb={4}>
                    <Typography variant="h2" color="primary" mb={1.5} ml={2} fontSize={14}>
                      {char}
                    </Typography>
                    {filteredContacts.map((contact , index) => {             
                      if (contact.name[0].toUpperCase() == char)
                        return <OneContact key={index} onShowContacts={onShowContacts} contactDetails={contact}/>;
                    })}
                  </Box>
                );

              })}
            </List>
          </Box>

        </Box>
      </Slide>
    );
}
