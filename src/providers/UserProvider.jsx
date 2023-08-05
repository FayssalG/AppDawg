import React, {createContext, useContext , useEffect, useReducer, useState} from 'react'


import { useAuth } from './AuthProvider'
import useChatId from '../hooks/useChatId'

import { getDoc , doc , setDoc , updateDoc  } from 'firebase/firestore'
import {get , set, ref , child } from 'firebase/database'
import {getDownloadURL,uploadBytes  , getStorage} from 'firebase/storage'

import {ref as storeRef  } from 'firebase/storage'
 
import  {firestoreDb} from '../config/firebase'
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
      const docSnap = await getDoc(doc(firestoreDb , 'users' , user.uid))
      if( docSnap.data()){
        dispatch({type:'all' , payload:docSnap.data()})
      }else{
        let newData = {chatId: id , displayName : user.displayName , photoURL:'' , infos:'Hi I m new to AppDawg'}
        setDoc(doc(firestoreDb , 'users' , user.uid) , newData)
        dispatch({type:'all' , payload:newData})
      
      }
    }
    getUserData()
  },[])

  function updateDisplayName(newName ){
    if(newName == null) return
    //set(ref(db , 'users/'+user.uid+'/displayName') , newName ? newName : user.displayName)
    updateDoc(doc(firestoreDb , 'users' , user.uid) , {displayName : newName})
  }

  async function updatePhotoURL(file){
    const link = await upload(file)
  //   set(ref(db , 'users/'+user.uid+'/photoURL') , link)
    updateDoc(doc(firestoreDb , 'users' , user.uid) , {photoURL : link})
  }

  function updateInfos(newInfos){
    if(!newInfos) return
    //set(ref(db , 'users/'+user.uid+'/infos') , newInfos)
    updateDoc(doc(firestoreDb , 'users' , user.uid) , {infos : newInfos})
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
