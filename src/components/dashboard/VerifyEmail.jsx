import React from 'react'
import {Box , Button, Paper, Typography} from '@mui/material'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

export default function VerifyEmail({signOut , resendVerificationEmail}) {
  return (
    <Box height='100vh' width='100vw' display='flex' alignItems='center' justifyContent='center'>
      <Paper elevation={10} sx={{p:5, borderRadius:4 }}>
        <Box mb={3} marginX='auto'maxWidth='fit-content'>
          <MarkEmailReadIcon sx={{width:50 , height:50}}/>
        </Box>
        <Typography mb={4} fontSize={22} >A confirmation link has been sent to your email</Typography>
        <Box  display='flex' gap={2} justifyContent='center'>
          <Button onClick={signOut} >sign out</Button>
          <Button variant='contained' onClick={resendVerificationEmail} >Resend</Button> 
        </Box>
      </Paper>
    </Box>
  )
}
