import React, { useState , useRef} from 'react'
import {Paper, Box , List, Typography  } from '@mui/material'
import OneDiscussion from './OneDiscussion'
import { useDiscussions } from '../../../../providers/DiscussionsProvider'


export default function Discussions() {
    const {discussions } = useDiscussions()
    
    return (
    <Box overflow='auto' sx={{maxHeight:'79vh', width:'100%', pb:4,display:'flex' , flexDirection : 'column' , alignItems: 'center' }}>
        

        <Box sx={{width:'100%'}}>
            <List >
                {
                    discussions.map((discussion , index)=>{
                        if(discussion.messages.length == 0) return null
                        return <OneDiscussion key={index}  active={discussion.isActive} recipient={discussion.recipient} lastMsg={'Hi mark'}/>
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
