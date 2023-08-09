import React , {useContext ,useState, createContext, useEffect , useCallback , useMemo} from 'react'
import {   query , getDoc, getDocs, updateDoc , doc ,setDoc  , deleteDoc, collection , where, arrayUnion } from 'firebase/firestore'
import { firestoreDb as db} from '../config/firebase'

import useLocalStorage from '../hooks/useLocalStorage'
import { useSocket } from './SocketProvider'
import {useUser} from './UserProvider'
import {useContacts} from './ContactsProvider'
import {useOtherUsers} from './OtherUsersProvider'
import { update } from 'firebase/database'


 

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
    })   

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

    function findDiscussionByDiscussionId(discussionId){
        return discussions.find((d)=>{
            return d.discussionId == discussionId
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
        updateDoc(discussionDoc , {
            availableTo : arrayUnion(userId)

        })
        .catch((err)=>{      
            setDoc(discussionDoc , {
                discussionId : discussionId,
                recipients : [userId , recipient.id],
                availableTo : [userId , recipient.id]
            })     
        })
    

        const messagesDoc = doc(db , 'discussions', discussionId , 'messages' ,  message.messageId)
        setDoc(messagesDoc  , {
            messageId : message.messageId,
            senderName:message.senderName,
            senderId : message.senderId,
            content: message.content,
            time : message.time
        })         
    }

    async function checkIfUserBlocked(idUserA ,idUserB){
        //checks if this user A is blocked by user B
        const usersRef = collection(db , 'users')
        const q = query(usersRef , where('chatId' , '==' , idUserB))
        const docSnap = await getDocs(q)
        let data
        docSnap.forEach((doc)=>{
            data = doc.data()    
        })  
        if(!data) return false
        if(data.blockedUsers.includes(idUserA)) return true
        return false
    }    
    
    function addMessageToDiscussion(discussionId , recipient , message){
        const newDiscussions = [...discussions]
            newDiscussions.forEach((discussion)=>{
                if(discussion.isActive == true){
                    discussion.messages.push(message)
                }
            })
            
        setDiscussions(newDiscussions)

        checkIfUserBlocked(userId ,recipient.id)
        .then((isBlocked)=>{
            if(isBlocked) return
            socket.emit('send-message' , {discussionId , recipient , message})
            updateDiscussionInDb(userId , recipient , message ,discussionId)                
        })
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

       
    },[discussions ])
    
    function deleteDiscussion(discussionId){
        const discussionDoc = doc(db , 'discussions' , discussionId)
        const discussion = findDiscussionByDiscussionId(discussionId)
        updateDoc(discussionDoc , {
            availableTo : [discussion.recipient.id]
        })

        const newDiscussions = discussions.filter((d)=>d.discussionId != discussionId)
        setDiscussions(newDiscussions)
    }

    const  getUserDiscussions = useCallback(async (id )=>{
        const discussionsRef = collection(db , 'discussions')
        const q = query(discussionsRef , where('availableTo' , 'array-contains' , id)) 
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
            const discussion = {discussionId :doc.data().discussionId, recipient :{id:recipient , name:recipient } , isActive:false , messages:[{senderName:'' , senderId:'' , content:''}] }            
            newDiscussions.push(discussion)
            
        })        
        return newDiscussions
        
     },[])
     
    

    async function getMessages(discussionsTofill){
        discussionsTofill.forEach(async (discussion)=>{
            const messagesRef = collection(db , 'discussions' , discussion.discussionId , 'messages')
            const messagesSnap = await getDocs(messagesRef)
            let messages = []
            messagesSnap.forEach((doc)=>{
                let message = doc.data()
                messages = [...messages , message]
            })
            discussion.messages = [...messages]
        })
        return discussionsTofill
    }


    
    //Updating the state when message status is changed
    
    function updateIsRecievedMessageStatus(discussionId, messageId){
        const messageDoc = doc(db , 'discussions' , discussionId , 'messages' , messageId)
        updateDoc(messageDoc , {isReceived:true}) 
    
        const discussion = discussions.find((discussion)=>{
            return discussion.discussionId == discussionId
        })
      
    
        socket.emit('message-received' , 
        {recipientId :discussion.recipient.id , discussionId ,messageId})
      
    }

    function updateIsSeenMessageStatus(discussionId , messageId){
        const messageDoc = doc(db , 'discussions' , discussionId , 'messages' , messageId)
        updateDoc(messageDoc , {isSeen:true}) 
        
        const discussion = discussions.find((discussion)=>{
            return discussion.discussionId == discussionId
        })
    
        socket.emit('message-seen' , 
        {recipientId :discussion.recipient.id , discussionId })
      
    }


    function getUpdatedIsSeenMessageStatus({discussionId , messageId}){
        const newDiscussions = discussions.map((discussion)=>{
            if(discussion.discussionId==discussionId){
                const updatedMessages = discussion.messages.map((msg)=>{
                    const updatedMessage = {...msg , isSeen:true , isReceived:true}
                    return updatedMessage
                })
                return {...discussion , messages: updatedMessages}
            }
            return discussion
        })

        setDiscussions(newDiscussions)
    }

    function getUpdatedIsReceivedMessageStatus({ discussionId , messageId}){
        const newDiscussions = discussions.map((discussion)=>{
            if(discussion.discussionId==discussionId){
                const updatedMessages = discussion.messages.map((msg)=>{
                    if(msg.messageId == messageId){
                        const updatedMessage = {...msg ,  isReceived:true}
                        return updatedMessage
                    }
                    return msg
                })
                return {...discussion , messages: updatedMessages}
            }
            return discussion
        })

        setDiscussions(newDiscussions)
    }



    //updates message status for the current user
    useEffect(()=>{
        if(!socket) return
        socket.on('message-seen-update' , getUpdatedIsSeenMessageStatus)
        socket.on('message-received-update' , getUpdatedIsReceivedMessageStatus)

       },[socket , activeDiscussion])
   
    
    //gets the users discussions
    useEffect(()=>{
        getUserDiscussions(userId)
        .then((newDiscussions)=>{
            return getMessages(newDiscussions)
        })
        .then((newDiscussions)=>{
            setDiscussions(newDiscussions)
        })
    },[])

    //handles message receiving
    useEffect(()=>{
        if(socket == null) return
        socket.on('recieve-message' , ({discussionId , recipient , message})=>{
            addRecievedMessageToDiscussion({discussionId , recipient , message})
            setTimeout(()=>updateIsRecievedMessageStatus(discussionId , message.messageId) , 4000)
        })
        return ()=>{
            socket.off('recieve-message')
            socket.off('retrieve-discussion')
        }
    },[socket   , addRecievedMessageToDiscussion])


    //handles isSeen status update for the other users
    useEffect(()=>{
        if(activeDiscussion && activeDiscussion.recipient.id != id){
            activeDiscussion.messages.forEach((msg)=>{
                if(msg.senderId == id) return
                if(msg.isSeen) return 
                updateIsSeenMessageStatus(activeDiscussion.discussionId ,msg.messageId)                
            })
        }
    })

        
   
   
   
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
        checkIfUserBlocked,
        deleteDiscussion,
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
