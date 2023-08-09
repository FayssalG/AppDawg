import React , {useState , useContext , createContext, useEffect} from 'react'
import {getDocs , query  , where , collection } from 'firebase/firestore'
import {firestoreDb as db} from '../config/firebase'

import { useSocket } from './SocketProvider'
import { useDiscussions } from './DiscussionsProvider'


const OtherUsersContext = createContext()

export function useOtherUsers(){
    return useContext(OtherUsersContext)
}

export default function OtherUsersProvider({children}) {
    const socket = useSocket()
    const [connectedUsers , setConnectedUsers] = useState({})
    
    useEffect(()=>{
        if(!socket) return
        socket.on('users-status' , getConnectedUsers)
        socket.on('user-connected' , updateConnectedUsers)
        socket.on('user-disconnected' , updateConnectedUsers)
    },[socket])

    function getConnectedUsers(connectedUsers){
        setConnectedUsers(connectedUsers)
    }

   

    function updateConnectedUsers({recipientId , newStatus}){
        setConnectedUsers((prev)=>{
            let newObj = {...prev}
            newObj[recipientId] = newStatus
            return newObj
        })
    }
    

    async function getOtherUserDetails(recipientId){
        const usersRef = collection(db , 'users' )
        const q = query(usersRef , where('chatId' , '==' ,recipientId))
        const snapshot = await getDocs(q)
        let data
        snapshot.forEach((doc)=>{
            data = doc.data()
        })
        return data
    }
    
  return (
    <OtherUsersContext.Provider value={{connectedUsers , getOtherUserDetails}}>
        {children}
    </OtherUsersContext.Provider>
  )
}
