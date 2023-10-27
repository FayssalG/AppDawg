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
    const [discussions , setDiscussions] = useLocalStorage('discussions',[])
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

    console.log({discussions})

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

        setShowDiscussion(true)
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
            const newDiscussions = [...discussions]
            newDiscussions.push({discussionId :discussionId , recipient:recipient , messages:[message] , isActive:false})
        
            setDiscussions(newDiscussions)
        }

       
    },[discussions ])
    
    function deleteDiscussion(discussionId){
        const newDiscussions = discussions.filter((d)=>d.discussionId != discussionId)
        setDiscussions(newDiscussions)
    }

    
    //Updating the state when message status is changed
    
    function updateIsRecievedMessageStatus(discussionId, messageId){
    
        const discussion = discussions.find((discussion)=>{
            return discussion.discussionId == discussionId
        })
      
        if(discussion){
            socket.emit('message-received' , 
            {recipientId :discussion.recipient.id , discussionId ,messageId})
    
        }
      
    }

    function updateIsSeenMessageStatus(discussionId , messageId){
        
        const discussion = discussions.find((discussion)=>{
            return discussion.discussionId == discussionId
        })
        
        if(discussion) {
            socket.emit('message-seen' , 
            {recipientId : discussion.recipient.id , discussionId })    
        }
      
    }

  

     function setUpdatedMessageStatus({discussionId , messageId , type}){
        if(!findDiscussionByDiscussionId(discussionId)) return 
        let newDiscussions
        if(type == 'seen'){

             newDiscussions = discussions.map((discussion)=>{
                if(discussion.discussionId==discussionId){
                    const updatedMessages = discussion.messages.map((msg)=>{
                        const updatedMessage = {...msg , isSeen:true , isReceived:true}
                        return updatedMessage
                    })
                    return {...discussion , messages: updatedMessages}
                }
                return discussion
            })
        }else{
            newDiscussions = discussions.map((discussion)=>{
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
        }
        setDiscussions(newDiscussions)
    }


    //updates message status for the current user
    useEffect(()=>{
        if(!socket) return
        socket.on('message-status-update' , setUpdatedMessageStatus)
        return ()=>{
            socket.off('message-status-update')
        }
       },[socket , activeDiscussion])
   
    

    //handles message receiving
    useEffect(()=>{
        if(socket == null) return
        socket.on('receive-message' , ({discussionId , recipient , message})=>{
            addRecievedMessageToDiscussion({discussionId , recipient , message})
            setTimeout(()=>updateIsRecievedMessageStatus(discussionId , message.messageId) , 1000)
        })
        return ()=>{
            socket.off('receive-message')
            socket.off('retrieve-discussion')
        }
    },[socket   , addRecievedMessageToDiscussion])


    //handles isSeen status update for the other users
    useEffect(()=>{
        if(activeDiscussion && activeDiscussion.recipient.id != id){
            activeDiscussion.messages.forEach((msg)=>{
                if(msg.senderId == id) return
                if(msg.isSeen) return 
                setTimeout(()=>updateIsSeenMessageStatus(activeDiscussion.discussionId ,msg.messageId) , 1000)                 
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
