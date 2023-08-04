import React from 'react'
import {TextField, Dialog , DialogTitle , DialogContent , DialogActions , Button , Box , Typography} from '@mui/material'
import { useContacts } from '../../../../providers/ContactsProvider'

export default function DeleteContactDialog({open, onClose , contactDetails}) {

    const {deleteContact} = useContacts()
    function handleDeleteContact(){
        deleteContact(contactDetails.id)
        onClose()
    }
    

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete contact</DialogTitle>
            <DialogContent sx={{width:400 }}>
                <Typography >Are you sure to delete this contact</Typography>
            </DialogContent>

            <DialogActions>
                <Button variant='outlined'   onClick={onClose}>cancel</Button>
                <Button variant='contained' onClick={handleDeleteContact}>Delete</Button>
            </DialogActions>
        </Dialog>


    )
}
