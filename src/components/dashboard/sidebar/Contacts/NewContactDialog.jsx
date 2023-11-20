import React, { useRef, useState } from 'react'
import {Box, Button , Dialog , DialogActions, DialogContent , TextField, DialogTitle, FormHelperText , DialogContentText } from '@mui/material'
import { useContacts } from '../../../../providers/ContactsProvider'
import { useOtherUsers } from '../../../../providers/OtherUsersProvider'

export default function NewContactDialog({onClose , open }) {
    const {addContact , contacts} = useContacts()
    const {checkIfUserExists} = useOtherUsers()

    const [contactName , setContactName] = useState(null)
    const [contactId , setContactId] = useState(null)
    const [error , setError] =useState(null) 
    
    function handleAddContact(){
        setError(false)
        if(contacts.find((contact)=>contact.id == contactId)){
            setError('This ID already exists in your contacts')
            return
        }
        checkIfUserExists(contactId)
        .then((isExist)=>{
            if(isExist ){
                addContact(contactId , contactName)      
                onClose()    
            }else{
                setError('This ID does not exist')
            } 

        })
    }
    
    return (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>New Contact</DialogTitle>
        <DialogContent sx={{width:400 }}>
            <Box display='flex' flexDirection='column' p={2} gap={2}>
                <TextField  label='Name' onChange={(e)=>setContactName(e.target.value)} />
                <TextField error={error ? error : false} label='Chat ID' onChange={(e)=>setContactId(e.target.value)} /> 
                {error!=null && <FormHelperText error >{error}</FormHelperText>}

            </Box>
        </DialogContent>

        <DialogActions>
            <Button onClick={onClose}>cancel</Button>
            <Button onClick={handleAddContact}>Add</Button>
        </DialogActions>
    </Dialog>
  )
}
