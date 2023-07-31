import React , {useContext ,useState, createContext, useEffect , useCallback} from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { useSocket } from './SocketProvider'

const DiscussionsContext = createContext()

export function useDiscussions(){
    return useContext(DiscussionsContext)
}

function generateId(){
    const chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let id = ''
    for(let i=0 ; i<8 ; i++){
      id += chars[Math.floor(Math.random()*chars.length)]
    }
    return id
  }


export default function DiscussionsProvider({children}) {   
    const [discussions , setDiscussions] = useState([])   
    const socket = useSocket()

    
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
  
    const recieveMessage = useCallback(({recipients , message})=>{
            addRecievedMessageToDiscussion(recipients , message)    
    },[])
   
    useEffect(()=>{
        if(socket == null) return
        socket.on('recieve-message' , recieveMessage)

        return ()=>socket.off('recieve-message')
    },[socket ])

    function addRecievedMessageToDiscussion(recipients , message){
      
        let fetched = fetchDiscussion(recipients)
        if(fetched){
            console.log('this should run second')    
            setDiscussions((prev)=>{
                prev.forEach((discussion)=>{
                    if(compareArrays(discussion.recipients , recipients)){
                        discussion.messages.push(message)
                    }
                })
            
                return [...prev]
            })
        }
        else{
            setDiscussions((prev)=>{
                let newDiscussions = prev
                newDiscussions.push({recipients:recipients , messages:[message]})
                return [...newDiscussions]
            })
        }
    }

    function openNewDiscussion(recipients){
        let activeDiscussion = findActiveDiscussion()
        if(activeDiscussion && compareArrays(activeDiscussion.recipients , recipients)){
            return
        }
        setDiscussions((prev)=>{
            return [...prev , {recipients , messages:[] , isActive:true}]
        })
    }

    function openOldDiscussion(recipients){

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

    function findActiveDiscussion(){
        return discussions.find((discussion)=>{
            return discussion.isActive == true
        })
    }

    const value = {
        discussions, 
        openNewDiscussion , 
        addMessageToDiscussion,
        activeDiscussion : findActiveDiscussion()
    }
    return (
        <DiscussionsContext.Provider value={value}>
            {children}
        </DiscussionsContext.Provider>
  )
}
