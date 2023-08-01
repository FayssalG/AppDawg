import React, {createContext, useContext} from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from './AuthProvider'
import useChatId from '../hooks/useChatId'

const UserContext = createContext()

export function useUser(){
    return useContext(UserContext)
}

export default function UserProvider({children}) {
  const {user} = useAuth()
  const [id] = useChatId(user)

  return (
    <UserContext.Provider value={{id , user}}>
        {children}
    </UserContext.Provider>
    )
}
