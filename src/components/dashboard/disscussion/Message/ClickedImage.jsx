//used to show the clicked image in fullscreen
import { CloseSharp, Download } from '@mui/icons-material'
import { Box, IconButton, Toolbar } from '@mui/material'
import React from 'react'

export default function ClickedImage({image,imageName , onClose}) {

    
    return (
    <Box bgcolor='black' position='fixed' zIndex={2} left={0} top={0} width='100%' height='100%'>
        <Toolbar sx={{display:'flex',justifyContent:'end'}}>
            <IconButton>
                <a style={{position:'absolute',padding:'100%'}}  href={image} download={imageName}></a>
                <Download/>
            </IconButton>
            <IconButton onClick={onClose}>
                <CloseSharp/>
            </IconButton>            
        </Toolbar>
        <Box   display='flex' justifyContent='center' alignItems='center'>
            <img  height='450px' style={{objectFit:'contain' , margin:'auto'}} src={image} alt="" />
        </Box>
    </Box>
  )
}
