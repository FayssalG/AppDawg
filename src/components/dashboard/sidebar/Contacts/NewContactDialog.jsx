import React, { useRef, useState } from 'react'
import {Box, Button , Dialog , DialogActions, DialogContent , TextField, DialogTitle , DialogContentText } from '@mui/material'

export default function NewContactDialog({onClose , open , onAddContact}) {
    const [contactName , setContactName] = useState(null)
    const [contactId , setContactId] = useState(null)

    return (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>New Contact</DialogTitle>
        <DialogContent>
            <Box display='flex' flexDirection='column' p={2} gap={2}>
                <TextField  label='Name' onChange={(e)=>setContactName(e.target.value)} />
                <TextField label='Chat ID' onChange={(e)=>setContactId(e.target.value)} /> 
            </Box>
        </DialogContent>

        <DialogActions>
            <Button onClick={onClose}>cancel</Button>
            <Button onClick={()=>onAddContact(contactId , contactName)}>Add</Button>
        </DialogActions>
    </Dialog>
  )
}
