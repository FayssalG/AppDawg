import React, { useEffect , useState} from 'react'
import {collection ,query , where, getDocs, addDoc , } from 'firebase/firestore'
import {db} from '../config/firebase'

import useLocalStorage from './useLocalStorage'




  const usersRef = collection(db , 'users')

  async function storeId(uid  , chatId){
        try{
            
            const docRef = await addDoc(usersRef , {
                uid : uid,
                chatId : chatId
            })
            console.log(docRef)
        }catch(err){
            console.log(err)
        }
  }

  function generateId(){
    const chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let id = ''
    for(let i=0 ; i<8 ; i++){
      id += chars[Math.floor(Math.random()*chars.length)]
    }
    return id
  }
  
 
export default function useChatId(uid){

    const [id , setId] = useLocalStorage('id')
    useEffect( ()=>{
        async function settingId(){
            const q = query(usersRef , where('uid' ,'==' , uid))
            const querySnapshot = await getDocs(q)
            let count = 0
            let data 
            querySnapshot.forEach((doc)=>{
                data=doc.data().chatId
                count++
            })
            if(count == 0){
                let newId = generateId()
                storeId(uid , newId)
                setId(newId)
            }else{
                setId(data)
            }
        }
        if(!id) settingId()
       
    },[id])

    return [id ]
}