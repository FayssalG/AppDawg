import React , {useContext ,useState, createContext, useEffect , useCallback} from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { useSocket } from './SocketProvider'

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
    const [discussions , setDiscussions] = useState([])   
    const socket = useSocket()

    function openNewDiscussion(recipients){
        let isDiscussionExist = findDiscussionByRecipients(recipients)
        
        if( isDiscussionExist){
            openOldDiscussion(recipients)
            return
        }

        const newDiscussions = [...discussions]
        newDiscussions.forEach((discussion)=>{
            discussion.isActive = false
        })
        newDiscussions.push({recipients , messages:[] , isActive:true})
        setDiscussions(newDiscussions)
    }

    function openOldDiscussion(recipients){
        const newDiscussions = [...discussions]
        newDiscussions.forEach((discussion)=>{
            discussion.isActive = false
            if(compareArrays(discussion.recipients , recipients)){
                discussion.isActive = true
            }
        })
        setDiscussions(newDiscussions)
    }



    function addMessageToDiscussion(recipients , message){
        socket.emit('send-message' , {recipients , message})
        const newDiscussions = [...discussions]
            newDiscussions.forEach((discussion)=>{
                if(discussion.isActive == true){
                    discussion.messages.push(message)
                }
            })
        setDiscussions(newDiscussions)
    }

    
    

    const addRecievedMessageToDiscussion = useCallback( ({recipients , message})=>{
        const isDiscussionExist = findDiscussionByRecipients(recipients) 

        if(isDiscussionExist){
            const newDiscussions = [...discussions]
            newDiscussions.forEach((discussion)=>{
                if(compareArrays(discussion.recipients , recipients)){
                    discussion.messages.push(message)
                }
            })
            console.log('new Discussions in case there is a discussion')
            console.log(newDiscussions)
            
            setDiscussions(newDiscussions)
        }
        else{        
            const newDiscussions = [...discussions]
            newDiscussions.push({recipients:recipients , messages:[message] , isActive:false})
           
            setDiscussions(newDiscussions)
        }
    },[discussions])



    useEffect(()=>{
        if(socket == null) return
        socket.on('recieve-message' , addRecievedMessageToDiscussion)

        return ()=>socket.off('recieve-message')
    },[socket , addMessageToDiscussion])


    
    
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

    function findDiscussionByRecipients(recipients){
        return discussions.find((d)=> {
            return compareArrays(d.recipients , recipients)
        }) 
    }


    return (
        <DiscussionsContext.Provider value={value}>
            {children}
        </DiscussionsContext.Provider>
  )
}
