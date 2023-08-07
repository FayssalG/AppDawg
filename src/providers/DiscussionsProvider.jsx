import React , {useContext ,useState, createContext, useEffect , useCallback , useMemo} from 'react'
import {   query , getDoc, getDocs, updateDoc , doc ,setDoc , addDoc , collection , where} from 'firebase/firestore'
import { firestoreDb as db} from '../config/firebase'

import useLocalStorage from '../hooks/useLocalStorage'
import { useSocket } from './SocketProvider'
import {useUser} from './UserProvider'
import {useContacts} from './ContactsProvider'
import {useOtherUsers} from './OtherUsersProvider'


 

const DiscussionsContext = createContext()

export function useDiscussions(){
    return useContext(DiscussionsContext)
}



export default function DiscussionsProvider({children}) {
    const {id} = useUser()
    const {contacts} = useContacts()   
    const userId = id
    const [discussions , setDiscussions] = useState([])
    const socket = useSocket()

    const activeDiscussion = useMemo(()=>{
        return findActiveDiscussion()
    },[discussions])   

    // helper functions
    function findActiveDiscussion(){
        return discussions.find((discussion)=>{
            return discussion.isActive == true
        })
    }

    function findDiscussionByRecipient(recipient){
        return discussions.find((d)=> {
            return d.recipient.id == recipient.id
        }) 
    }

    ///////////////


    function openNewDiscussion(recipient){
        let isDiscussionExist = findDiscussionByRecipient(recipient)
        if( isDiscussionExist){
            openOldDiscussion(recipient)
            return
        }

        const newDiscussions = [...discussions]
        newDiscussions.forEach((discussion)=>{
            discussion.isActive = false
        })
        const discussionId = userId + recipient.id
        newDiscussions.push({discussionId:discussionId , recipient , messages:[] , isActive:true})
        setDiscussions(newDiscussions)
    }

    function openOldDiscussion(recipient){
        const newDiscussions = [...discussions]
        newDiscussions.forEach((discussion)=>{
            discussion.isActive = false
            if(discussion.recipient.id == recipient.id){
                discussion.isActive = true
            }
        })
        setDiscussions(newDiscussions)

        setShowDiscussion(true)
    }


    function addMessageToDiscussion(discussionId , recipient , message){
        socket.emit('send-message' , {discussionId , recipient , message})
        const newDiscussions = [...discussions]
            newDiscussions.forEach((discussion)=>{
                if(discussion.isActive == true){
                    discussion.messages.push(message)
                }
            })
            
        setDiscussions(newDiscussions)
        console.log(discussions)

        updateDiscussionInDb(userId , recipient , message ,discussionId)
    }


    const addRecievedMessageToDiscussion = useCallback( ({discussionId , recipient , message})=>{
        const isDiscussionExist = findDiscussionByRecipient(recipient) 
        
        if(isDiscussionExist){
            const newDiscussions = [...discussions]
            newDiscussions.forEach((discussion)=>{
                if(recipient.id == discussion.recipient.id){
                    discussion.messages.push(message)
                    
                }
            })
            
            setDiscussions(newDiscussions)
        }
        else{       
            setDiscussions((prev)=>[...prev , {discussionId :discussionId , recipient:recipient , messages:[message] , isActive:false}])
        }

       
        setTimeout(()=>updateIsRecievedMessageStatus(discussionId , message.messageId) , 5000)
    },[discussions ])
    
   

    const  getUserDiscussions = useCallback(async (id )=>{
        const discussionsRef = collection(db , 'discussions')
        const q = query(discussionsRef , where('recipients' , 'array-contains' , id)) 
        const snapshot = await getDocs(q)        
        // snapshot.forEach((doc)=>{
        //      if(doc.data()){
                
        //         doc.data().recipients.forEach((recipient)=>{
        //             if(recipient !== id){
        //                 newDiscussions.push( {discussionId :doc.data().discussionId, recipient :{id:recipient , name:recipient } , isActive:false , messages:doc.data().messages } )
        //             }
        //          })
        //      }
        // })
        let newDiscussions = [...discussions]
        snapshot.forEach(async (doc)=>{
            let data = doc.data()
            const [recipient] = data.recipients.filter((r)=>r!=id)
            const messages = await getDiscussionMessages(doc.data().discussionId)
            const discussion = {discussionId :doc.data().discussionId, recipient :{id:recipient , name:recipient } , isActive:false , messages:messages }
            
            newDiscussions.push(discussion)
            
        })        
        setDiscussions(newDiscussions)

        
     },[])
     
    console.log({discussions})
    function updateDiscussionInDb( userId , recipient , message , discussionId){
        // async function getDiscussion(discussionId){
        //     const  docSnap = await getDoc( doc(db ,'discussions' , discussionId ))
        //     let data = docSnap.data() 
            
        //     const messagesDb = collection(db , 'discussions' , discussionId , 'messages' )
        //     return data
        // }
        // getDiscussion(discussionId)
        // .then((data)=>{
            
        //     if(data){
        //         const docRef = doc(db , 'discussions' , discussionId)
        //         updateDoc(docRef ,{messages : [...data.messages , message]})
               
        //     }
        //     else{
        //         const discussionsRef = doc(db , 'discussions' , discussionId) 

        //         setDoc(discussionsRef , {
        //             discussionId : discussionId,
        //             recipients : [userId , recipient.id],
        //             messages : [message]
                    
        //         })
        //     }
        
        // })
        // .catch((err)=>{
        //     console.log(err)
        // })
        const discussionDoc = doc(db , 'discussions' , discussionId)
        setDoc(discussionDoc , {
            discussionId : discussionId,
            recipients : [userId , recipient.id]
        })
        const messagesDoc = doc(db , 'discussions',discussionId ,'messages' ,  message.messageId)
        setDoc(messagesDoc  , {
            messageId : message.messageId,
            senderName:message.senderName,
            senderId : message.senderId,
            content: message.content,
        })        
    }
    

    async function getDiscussionMessages(discussionId){
        const messagesRef = collection(db , 'discussions' , discussionId , 'messages')
        const messagesSnap = await getDocs(messagesRef)
        const messages = []
        messagesSnap.forEach((doc)=>{
            messages.push(doc.data())
        })
        return messages
    }

    function updateIsRecievedMessageStatus(discussionId, messageId){
        console.log({messageId})
        const messageDoc = doc(db , 'discussions' , discussionId , 'messages' , messageId)
        updateDoc(messageDoc , {isRecieved:true}) 
    }

    function updateIsSeenMessageStatus(discussionId , messageId){
        const messageDoc = doc(db , 'discussions' , discussionId , 'messages' , messageId)
        updateDoc(messageDoc , {isSeen:true}) 
        
    }

    useEffect(()=>{
        getUserDiscussions(userId)
             
    },[])

     
    useEffect(()=>{
        if(socket == null) return
        socket.on('recieve-message' , addRecievedMessageToDiscussion)
        return ()=>{
            socket.off('recieve-message')
            socket.off('retrieve-discussion')
        }
    },[socket   , addRecievedMessageToDiscussion])


    
    useEffect(()=>{
        if(activeDiscussion && activeDiscussion.recipient.id != id){
            activeDiscussion.messages.forEach((msg)=>{
                if(msg.isSeen) return 
                updateIsSeenMessageStatus(activeDiscussion.discussionId ,msg.messageId)                
            })
        }
    },[activeDiscussion])

    let filteredDiscussions= useMemo(()=>{
        let newDiscussions = [...discussions]
        newDiscussions.forEach((discussion)=>{
            let exisitingContact = contacts.find((contact)=>contact.id === discussion.recipient.id)
            if(exisitingContact) discussion.recipient.name = exisitingContact.name 
            else discussion.recipient.name = discussion.recipient.id             
        })
        return newDiscussions
    },[discussions , contacts])


    /////////////////////////

    /*
        Used only in MobileView component to 
        handle discussion visisbility on the screen
    */
    const [showDiscussion , setShowDiscussion] = useState(false)  

    const value = {
        showDiscussion,setShowDiscussion,
        discussions, 
        filteredDiscussions,
        openNewDiscussion , 
        openOldDiscussion,
        addMessageToDiscussion,
        activeDiscussion 
    }


    return (
        <DiscussionsContext.Provider value={value}>
            {children}
        </DiscussionsContext.Provider>
  )
}
