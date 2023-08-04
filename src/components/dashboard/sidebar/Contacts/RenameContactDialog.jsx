import React , {useState}from 'react'
import { useContacts } from '../../../../providers/ContactsProvider'
import {TextField, Dialog , DialogTitle , DialogContent , DialogActions , Button , Box } from '@mui/material'

export default function RenameContactDialog({open , onClose , contactDetails }) {
    const {id} = contactDetails    
    const {renameContact} = useContacts()

    const [newContactName , setNewContactName] = useState(null)
    function handleRenameContact(){
        if(newContactName == '') return
        renameContact(contactDetails.id , newContactName)
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Rename contact</DialogTitle>
            <DialogContent sx={{width:400 }}>
                <Box display='flex' flexDirection='column' p={2} gap={2}>
                    <TextField  label='Name' defaultValue={contactDetails.name} onChange={(e)=>setNewContactName(e.target.value)} />
                    <TextField disabled label='Chat ID' value={id} /> 
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>cancel</Button>
                <Button onClick={handleRenameContact}>Add</Button>
            </DialogActions>
        </Dialog>


    )
}
