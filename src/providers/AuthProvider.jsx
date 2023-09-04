import React , {createContext, useContext} from 'react'
import {useAuthState} from 'react-firebase-hooks/auth'
import { updateProfile, signInAnonymously , signInWithPopup , signInWithEmailAndPassword , createUserWithEmailAndPassword , GoogleAuthProvider, sendEmailVerification } from 'firebase/auth'
import {getDownloadURL,uploadBytes  , ref, getStorage} from 'firebase/storage'
import {auth } from '../config/firebase'



const AuthContext = createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
  const [user , isPending] = useAuthState(auth)

  function signUp(email , password , rePassword , setError){
    try{
      if(rePassword !== password){
        throw Error('repeated password does not match the password')
      }
      createUserWithEmailAndPassword(auth , email , password)
      .then((result)=>{
        result.user.updateProfile({
          displayName : ''
        })
        sendEmailVerification(auth.user)
      })     
      .catch((error)=>{
          setError(error.message)
      })
    }catch(err){
      setError(err.message)
    }
  }

  function resendVerificationEmail(){
    sendEmailVerification(user)
  }

  function signIn(email , password , setError){
    signInWithEmailAndPassword(auth , email ,password)
    .then((user)=>{
      console.log(user)
    })
    .catch((err)=>{
      setError(err.message)
    })
  }

  function anonymousSignIn(){
    signInAnonymously(auth)
    .then((user)=>{
      console.log(user)
    })
    .catch((err)=>{
      console.log(err.message)
    })
  }

  function googleSignIn(){
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth , provider)
  }

  function signOut(){
    localStorage.removeItem('updawg-id')
    auth.signOut()
    
  }

  function updateDisplayName(newName ){
    if(newName == null) return
    updateProfile(user , {
      displayName : newName
    })
  
  }

  async function updatePhotoURL(file){
    const link = await upload(file)
    updateProfile(user , {
      photoURL : link
    })
  }

  async function upload(file ){
    const storage = getStorage()
    const storageRef = ref(storage , user.uid )
    const snapshot = await uploadBytes(storageRef , file)
    const link = await getDownloadURL(storageRef)
    return link
  }

  return (
    <AuthContext.Provider value={{signOut , signIn, anonymousSignIn , googleSignIn ,updatePhotoURL, updateDisplayName , user , isPending , signUp , resendVerificationEmail}}>
        {children}
    </AuthContext.Provider>
  )
}
