import React, { useRef, useState } from 'react'
import {Box, Button , Dialog , DialogActions, DialogContent , TextField, DialogTitle , DialogContentText, Typography } from '@mui/material'

export default function AddToContactsDialog({onClose , open , contactId , onAddContact}) {
    const [contactName , setContactName] = useState(null)

    return (
    <Dialog open={open} onClose={onClose} >
        <DialogTitle>New Contact</DialogTitle>
        <DialogContent sx={{width:400 }}>
            <Box display='flex' flexDirection='column' p={2} gap={4}>
                <TextField  label='Name' onChange={(e)=>setContactName(e.target.value)} />
                <TextField disabled value={contactId} label='ID' onChange={(e)=>setContactName(e.target.value)} />
            </Box>
        </DialogContent>

        <DialogActions>
            <Button onClick={onClose}>cancel</Button>
            <Button onClick={()=>onAddContact(contactId , contactName)}>Add</Button>
        </DialogActions>
    </Dialog>
  )
}
