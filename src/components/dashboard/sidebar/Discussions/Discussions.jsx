import React, { useState , useRef} from 'react'
import {Paper, Box , List, Typography  } from '@mui/material'
import OneDiscussion from './OneDiscussion'
import { useDiscussions } from '../../../../providers/DiscussionsProvider'


export default function Discussions() {
    const {discussions } = useDiscussions()
    const [active , setActive] = useState(null)

    return (
    <Box overflow='auto' sx={{maxHeight:'90vh', width:'100%', pb:4,display:'flex' , flexDirection : 'column' , alignItems: 'center' }}>
        
        <Box sx={{width:'100%'}}>
            <List >
                {
                    discussions.map((discussion )=>{
                        if(discussion.messages.length == 0) return null
                        return <OneDiscussion  active={active} onActive={setActive} recipients={discussion.recipients[0]} lastMsg={'Hi mark'}/>
                    })
                }
        
            </List>
        </Box>
        
    </Box>

    )    
    
}
