import React, {createContext, useContext , useEffect, useReducer, useState} from 'react'


import { useAuth } from './AuthProvider'
import useChatId from '../hooks/useChatId'


import {get , set, ref , child } from 'firebase/database'
import {getDownloadURL,uploadBytes  , getStorage} from 'firebase/storage'
import {ref as storeRef  } from 'firebase/storage'
 
import {db} from '../config/firebase'
import { Navigate } from 'react-router-dom'
import { useSocket } from './SocketProvider'

const UserContext = createContext()

export function useUser(){
    return useContext(UserContext)
}



function reducer(state , action){
  switch(action.type){
    case 'displayname':
      return {...state , displayName:action.payload};
    case 'infos':
      return {...state , infos:action.payload};
    case 'photourl':
      return {...state , photoURL:action.payload};
    case 'all':
      return action.payload 
  }
}

export default function UserProvider({children}) {
  const {user} = useAuth()
 

  const [userData , dispatch] = useReducer(reducer ,{displayName:'' , infos:'' , photoURL:''})
  const [id] = useChatId(user)


  useEffect(()=>{
    async function getUserData(){
      let data 
      const dbRef = ref(db)
      const snapshot = await get(child(dbRef , 'users/'+user.uid))
    
      if(snapshot.exists()){
        console.log(snapshot.val())
        dispatch({type:'all' , payload:snapshot.val()}) 
      }else{
        console.log('No data')
      }
    }
    getUserData()
  },[])

  function updateDisplayName(newName ){
    if(newName == null) return
    set(ref(db , 'users/'+user.uid+'/displayName') , newName ? newName : user.displayName)
  }

  async function updatePhotoURL(file){
    const link = await upload(file)
    set(ref(db , 'users/'+user.uid+'/photoURL') , link)
  }

  function updateInfos(newInfos){
    if(!newInfos) return
    set(ref(db , 'users/'+user.uid+'/infos') , newInfos)
  }

  async function upload(file ){
    const storage = getStorage()
    const storageRef = storeRef(storage , user.uid )
    const snapshot = await uploadBytes(storageRef , file)
    const link = await getDownloadURL(storageRef)
    return link
  }


  
  return (
    <UserContext.Provider value={{id , user ,dispatch  , userData , updateDisplayName , updatePhotoURL , updateInfos }}>
        {children}
    </UserContext.Provider>
    )
}
