import React, { useEffect , useState} from 'react'
import {collection ,query , where, getDocs, addDoc, getDoc , doc , setDoc, updateDoc} from 'firebase/firestore'
import {  ref , set ,get , child} from 'firebase/database'
import {firestoreDb as db} from '../config/firebase'

import useLocalStorage from './useLocalStorage'

  async function storeId(user  , chatId){

        try{    
            // set(ref(db , 'users/'+user.uid) , {
            //     uid : user.uid,
            //     chatId : chatId,
            //     photoURL: user.photoURL,
            //     infos : 'Hi Im new to AppDawg',
            //     displayName : user.displayName
            // })
            updateDoc(doc(db , 'users' , user.uid) , {
                chatId : chatId
            })
        }catch(err){
            console.log(user.uid)
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
  
 
export default function useChatId(user){

    const [id , setId] = useLocalStorage('id')
    useEffect( ()=>{
        async function settingId(){
            // let data
            // const dbRef = ref(db)
            // const snapshot = await get(child(dbRef , `users/${user.uid}/chatId`))
            // if(snapshot.exists()){
            //     data = snapshot.val()
            //     setId(data)
            // }else{
            //     console.log(user.uid)

            //     console.log('No data')
            //     let newId = generateId()
            //     storeId(user , newId)
            //     setId(newId)
            // }
            let data
            const snapshot = await getDoc(doc(db , 'users' , user.uid))
            if(snapshot.exists()){
                data = snapshot.data()
                console.log(data)
                setId(data.chatId)
            }else{

                console.log('No data')
                let newId = generateId()
                storeId(user , newId)
                setId(newId)
                
            }
        }
        if(!id) settingId()
       
    },[id ])

    return [id ]
}