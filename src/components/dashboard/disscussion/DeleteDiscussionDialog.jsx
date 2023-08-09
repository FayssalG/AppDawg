import React from 'react'
import {TextField, Dialog , DialogTitle , DialogContent , DialogActions , Button , Box , Typography} from '@mui/material'
import { useContacts } from '../../../providers/ContactsProvider'
import { useDiscussions } from '../../../providers/DiscussionsProvider'

export default function DeleteDiscussionDialog({open, onClose , discussionId}) {

    const {deleteDiscussion} = useDiscussions()
    function handleDeleteDiscussion(){
        deleteDiscussion(discussionId)
        onClose()
    }
    

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Discussion</DialogTitle>
            <DialogContent sx={{width:400 }}>
                <Typography >Are you sure to delete this Discussion</Typography>
            </DialogContent>

            <DialogActions>
                <Button variant='outlined'   onClick={onClose}>cancel</Button>
                <Button variant='contained' onClick={handleDeleteDiscussion}>Delete</Button>
            </DialogActions>
        </Dialog>


    )
}
