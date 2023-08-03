import React , {useContext ,useState, createContext, useEffect , useCallback} from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { useSocket } from './SocketProvider'
import {useUser} from './UserProvider'

const DiscussionsContext = createContext()

export function useDiscussions(){
    return useContext(DiscussionsContext)
}


function compareArrays(a , b){   
    if(a.length != b.length) return false
    a.sort((a , b)=>{
        return a.id < b.id
    })
    b.sort((a , b)=>{
        return a.id < b.id
    })
    let result = a.every((item , index)=>{
        return item.id == b[index].id
    }) 
    return result
}



export default function DiscussionsProvider({children}) {
    const {id} = useUser()   
    const userId = id

    const [discussions , setDiscussions] = useState([])   
    const socket = useSocket()

    function openNewDiscussion(recipient){
        let isDiscussionExist = findDiscussionByRecipient(recipient)
        if( isDiscussionExist){
            openOldDiscussion(recipient)
            return
        }

        const newDiscussions = [...discussions]
        newDiscussions.forEach((discussion)=>{
            discussion.isActive = false
        })
        const discussionId = userId + recipient.id
        newDiscussions.push({discussionId:discussionId , recipient , messages:[] , isActive:true})
        setDiscussions(newDiscussions)
    }

    function openOldDiscussion(recipient){
        const newDiscussions = [...discussions]
        newDiscussions.forEach((discussion)=>{
            discussion.isActive = false
            if(discussion.recipient.id == recipient.id){
                discussion.isActive = true
            }
        })
        setDiscussions(newDiscussions)
    }



    function addMessageToDiscussion(discussionId , recipient , message){
        socket.emit('send-message' , {discussionId , recipient , message})
        const newDiscussions = [...discussions]
            newDiscussions.forEach((discussion)=>{
                if(discussion.isActive == true){
                    discussion.messages.push(message)
                }
            })
        setDiscussions(newDiscussions)
    }

    
    const addRetrievedDiscussion = useCallback(({discussionId , recipient , messages})=>{
        setDiscussions((prev)=>[...prev , {discussionId :discussionId , recipient:recipient , messages:[...messages] , isActive:false}])
    
    },[discussions])

    const addRecievedMessageToDiscussion = useCallback( ({discussionId , recipient , message})=>{
        const isDiscussionExist = findDiscussionByRecipient(recipient) 
        
        if(isDiscussionExist){
            const newDiscussions = [...discussions]
            newDiscussions.forEach((discussion)=>{
                if(recipient.id == discussion.recipient.id){
                    discussion.messages.push(message)
                }
            })
            console.log('new Discussions in case there is a discussion')
            
            setDiscussions(newDiscussions)
        }
        else{        
            setDiscussions((prev)=>[...prev , {discussionId :discussionId , recipient:recipient , messages:[message] , isActive:false}])
        }
    },[discussions])



    useEffect(()=>{
        if(socket == null) return
        socket.on('retrieve-discussion' , addRetrievedDiscussion)
        socket.on('recieve-message' , addRecievedMessageToDiscussion)
        
        return ()=>{
            socket.off('recieve-message')
            socket.off('retrieve-discussion')
        }
    },[socket  , addRetrievedDiscussion , addRecievedMessageToDiscussion])


    
    
    const value = {
        discussions, 
        openNewDiscussion , 
        openOldDiscussion,
        addMessageToDiscussion,
        activeDiscussion : findActiveDiscussion(),
    }

    function findActiveDiscussion(){
        return discussions.find((discussion)=>{
            return discussion.isActive == true
        })
    }

    function findDiscussionByRecipient(recipient){
        return discussions.find((d)=> {
            return d.recipient.id == recipient.id
        }) 
    }


    return (
        <DiscussionsContext.Provider value={value}>
            {children}
        </DiscussionsContext.Provider>
  )
}
