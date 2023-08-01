import React, { useMemo, useState } from 'react'
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Paper,Slide , Box , List, Typography , AppBar, Divider} from '@mui/material'

import OneContact from './OneContact';
import NewContactDialog from './NewContactDialog';
import NewContactButton from './NewContactButton';

import { useContacts } from '../../../../providers/ContactsProvider';
import {useDiscussions} from '../../../../providers/DiscussionsProvider'

export default function Contacts({onShowContacts , showContacts}) {
    const {contacts , addContact} = useContacts()

    const [open , setOpen] = useState(false)

    const alphabets = useMemo(()=>{
        let chars= contacts.map((c)=>{
            return c.name[0].toUpperCase()
        })
        chars.sort()
        chars = chars.filter((item , index)=>{
            return chars.indexOf(item) === index
        })
        return chars 
    })
    
    function handleOpen(){
        setOpen(true)
    }

    function handleClose(){
        setOpen(false)
    }

    function handleAddContact(contactId , contactName){
        addContact(contactId , contactName)
        setOpen(false)
    }

    return (
      <Slide direction="right" in={showContacts} mountOnEnter unmountOnExit>
        <Box
          backgroundColor='primary.dark' 
          sx={{
            position: "absolute",
            zIndex: 2,
            height: "100%",
            width: "100%",
            pb: 4,
            left: 0,
            top: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >

          <AppBar sx={{backgroundColor:'topbar.main'}} position="static" >
            <Box sx={{display: "flex", gap: 4, p: "4rem 0 1rem 1rem", alignItems: "center" }}>
              <ArrowBackIcon sx={{ cursor: "pointer" }} onClick={() => onShowContacts(false)}/>
              <Typography variant="p" fontWeight="bold" fontSize="1.1rem">
                New Discussion
              </Typography>
            </Box>
          </AppBar>

          <Box sx={{ width: "100%", pt: 4, overflow: "auto" }}>
            <Box mb={4}>
                <NewContactButton onClick={handleOpen}  >
                  NewContact
                </NewContactButton>
                <NewContactDialog onAddContact={handleAddContact} onClose={handleClose} open={open}/>
            </Box>

            <Typography mb={4} textTransform="uppercase" px={2} variant="h1" fontSize={19} color="primary">
              Your Contacts
            </Typography>
            <List>
              {alphabets.map((char , index) => {

                return (
                  <Box key={index} mb={4}>
                    <Typography variant="h2" color="primary" mb={2} ml={2} fontSize={14}>
                      {char}
                    </Typography>
                    {contacts.map((contact , index) => {             
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
