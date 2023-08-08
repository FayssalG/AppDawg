import React from 'react'
import {TextField, Dialog , DialogTitle , DialogContent , DialogActions , Button , Box , Typography} from '@mui/material'

export default function BlockUserDialog({open, onClose  , onBlock }) {
    

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Block contact</DialogTitle>
            <DialogContent sx={{width:400 }}>
                <Typography >Are you sure to Block this user</Typography>
            </DialogContent>

            <DialogActions>
                <Button variant='outlined'   onClick={onClose}>cancel</Button>
                <Button variant='contained' onClick={onBlock}>Block</Button>
            </DialogActions>
        </Dialog>


    )

}
