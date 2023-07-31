import React , {useContext , createContext, useState, useEffect} from 'react'
import io, { Socket } from 'socket.io-client'

const SocketContext = createContext()
export function useSocket(){
    return useContext(SocketContext)
}

export default function SocketProvider({id , children}) {
    const [socket , setSocket] = useState(null)

    useEffect(()=>{
        const hostname ='http://192.168.1.37:'
        const port = 5000
        const newSocket = io(hostname+port , {
            query:{
                id:id
            }            
        })
        setSocket(newSocket)
        return ()=> newSocket.close()
    },[id])

    return (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
  )
}
