import React , {useState , useContext , createContext, useEffect} from 'react'
import { useSocket } from './SocketProvider'
import { useDiscussions } from './DiscussionsProvider'

const OtherUsersContext = createContext()

export function useOtherUsers(){
    return useContext(OtherUsersContext)
}

export default function OtherUsersProvider({children}) {
    const socket = useSocket()
    const [connectedRecipients , setConnectedRecipients] = useState({})
    console.log(connectedRecipients)
    
    useEffect(()=>{
        if(!socket) return
        socket.on('users-status' , getConnectedRecipients)
        socket.on('user-connected' , addConnectedRecipient)
        socket.on('user-disconnected' , removeDisconnectedRecipient)
    },[socket])

    function getConnectedRecipients(connectedUsers){
        //let generateArray = Array.from(new Array(100000), (val , index)=>'test'+index)
        setConnectedRecipients(connectedUsers)
    }

    function addConnectedRecipient({recipientId , newStatus}){
        setConnectedRecipients((prev)=>{
            let newObj = {...prev}
            newObj[recipientId] = newStatus
            return newObj
        })
      
    }

    function removeDisconnectedRecipient({recipientId , newStatus}){
        setConnectedRecipients((prev)=>{
            let newObj = {...prev}
            newObj[recipientId] = newStatus
            return newObj
        })
    }
    
  return (
    <OtherUsersContext.Provider value={{connectedRecipients}}>
        {children}
    </OtherUsersContext.Provider>
  )
}
