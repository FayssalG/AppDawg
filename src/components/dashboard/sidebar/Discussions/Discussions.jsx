import React, { useState , useRef} from 'react'

import MessageIcon from '@mui/icons-material/Message';
import {Paper, Box , List, Typography  } from '@mui/material'

import OneDiscussion from './OneDiscussion'
import { useDiscussions } from '../../../../providers/DiscussionsProvider'

import noDiscussionsImage from '../../../../Assets/no-discussions.svg'
export default function Discussions() {
    const {filteredDiscussions } = useDiscussions()
    
    return (
    <Box overflow='auto' sx={{maxHeight:'79vh', width:'100%', pb:4,display:'flex' , flexDirection : 'column' , alignItems: 'center' }}>
        

        <Box sx={{width:'100%'}}>
            {
                filteredDiscussions.length == 0 && (
                    <Box padding='0 40px' marginTop={15} >
                        <Box display='flex' justifyContent='center' >
                            <img style={{width:140 , height:140}} src={noDiscussionsImage}></img>
                        </Box>    
                        <Typography marginTop={2} display='flex' >Click on <MessageIcon sx={{width:20 , margin:'0 10px'}} /> to start a new chat </Typography>
                        <Typography marginTop={1} color='grey' lineHeight={1.5} fontSize={12} >You can chat with people whom you have their chat id saved in your contacts </Typography>
                    </Box>
                
                )
            }
            <List >
                {
                    filteredDiscussions.map((discussion , index)=>{
                        if(discussion.messages.length == 0) return null
                        return <OneDiscussion key={discussion.discussionId}  active={discussion.isActive} discussionId={discussion.discussionId} recipient={discussion.recipient} lastMsg={'Hi mark'}/>
                    })
                }
                {/* <OneDiscussion   active={false} recipients={{id:'YDZHH' , name:'smayka'}} lastMsg={'Hi mark'}/>
                <OneDiscussion   active={false} recipients={{id:'YDZHH' , name:'smayka'}} lastMsg={'Hi mark'}/>
                <OneDiscussion   active={false} recipients={{id:'YDZHH' , name:'smayka'}} lastMsg={'Hi mark'}/>
                <OneDiscussion   active={false} recipients={{id:'YDZHH' , name:'smayka'}} lastMsg={'Hi mark'}/>
                <OneDiscussion   active={false} recipients={{id:'YDZHH' , name:'smayka'}} lastMsg={'Hi mark'}/>
                <OneDiscussion   active={false} recipients={{id:'YDZHH' , name:'smayka'}} lastMsg={'Hi mark'}/>
                <OneDiscussion   active={false} recipients={{id:'YDZHH' , name:'smayka'}} lastMsg={'Hi mark'}/>
                <OneDiscussion   active={false} recipients={{id:'YDZHH' , name:'smayka'}} lastMsg={'Hi mark'}/>
                <OneDiscussion   active={false} recipients={{id:'YDZHH' , name:'smayka'}} lastMsg={'Hi mark'}/>
                <OneDiscussion   active={false} recipients={{id:'YDZHH' , name:'smayka'}} lastMsg={'Hi mark'}/> */}
            
            </List>
        </Box>
        
    </Box>

    )    
    
}
