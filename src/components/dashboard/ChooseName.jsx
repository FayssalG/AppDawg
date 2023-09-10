import React , {useRef, useState} from 'react'
import { Navigate , redirect } from 'react-router-dom'
import { useUser } from '../../providers/UserProvider'
import {Box , Paper, TextField, Typography , Button}  from '@mui/material'

export default function ChooseName() {
    const {updateDisplayName ,dispatch} = useUser()
    const [name , setName] = useState()
    
    function handleChange(e){
        setName(e.target.value)
    }
    
    function handleChooseName(){
        if(name == '') return
        dispatch({type:'displayname' , payload:name})
        updateDisplayName(name)
    }
    
    
    return (
        <Box height='90vh' display='flex' justifyContent='center' alignItems='center'>
            <Paper sx={{p:5, width:500 , borderRadius:4 }}>
                <Box mb={4}>
                    <Typography mb={2}  fontSize={19}>Choose a Name</Typography>
                    <Typography fontSize={12} color='grey' >This will be visible to your contacts and the people you chat with.</Typography>
                </Box>
                <TextField  sx={{mb:4  }} fullWidth size='small' onChange={handleChange}  label='Name' inputProps={{maxLength:14}} required></TextField>        
                <Box>
                    <Button onClick={handleChooseName}  variant='contained'>Done</Button>
                </Box>
            </Paper>            
        </Box>
    )
}
