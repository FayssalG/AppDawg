import React , {useState , useContext , createContext, useEffect} from 'react'
import { useSocket } from './SocketProvider'
import { useDiscussions } from './DiscussionsProvider'

const OtherUsersContext = createContext()

export function useOtherUsers(){
    return useContext(OtherUsersContext)
}

export default function OtherUsersProvider({children}) {
    const socket = useSocket()
    const {activeDiscussion , discussions} = useDiscussions()
    const [connectedUsers , setConnectedUsers] = useState([])

    useEffect(()=>{
        if(!socket) return
        const usersToCheck = discussions.map((discussion)=>discussion.recipient.id)
        socket.emit('check-user-state' , usersToCheck)
        socket.on('user-state' , (data)=>{
            setConnectedUsers([...data])
        })
        
    },[socket ,activeDiscussion , discussions])

    
  return (
    <OtherUsersContext.Provider value={{connectedUsers}}>
        {children}
    </OtherUsersContext.Provider>
  )
}
