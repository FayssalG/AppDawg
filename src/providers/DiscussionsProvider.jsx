import React , {useContext ,useState, createContext, useEffect , useCallback} from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { useSocket } from './SocketProvider'

const DiscussionsContext = createContext()

export function useDiscussions(){
    return useContext(DiscussionsContext)
}

function generateId(){
    const chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let id = ''
    for(let i=0 ; i<8 ; i++){
      id += chars[Math.floor(Math.random()*chars.length)]
    }
    return id
  }


export default function DiscussionsProvider({children}) {   
    const [discussions , setDiscussions] = useState([])
   
    const [activeDiscussion , setActiveDiscussion]= useState(null)
    useSocket()
    
    useEffect(()=>{
        if(activeDiscussion) {
            let oldDiscussion = fetchDiscussion(activeDiscussion.recipients)
            if(!oldDiscussion){
                setDiscussions(prev=>[...prev , activeDiscussion])
            }else{
                setDiscussions((prev)=>{
                    // let newDiscussions = prev.filter((discussion)=>{
                    //     return discussion.recipients.toString() != activeDiscussion.recipients.toString()
                    // })
                    prev.forEach((discussion)=>{
                        if(compareArrays(activeDiscussion.recipients , discussion.recipients)){
                            prev.splice(prev.indexOf(discussion) , 1 , activeDiscussion)
                        }
                    })
                    return [...prev] 
                })            
            }
        }
    },[activeDiscussion])

    
    function addMessageToDiscussion(recipients , message){
        socket.emit('send-message' , {recipients , message})
        setActiveDiscussion((prev)=>{
            return {...prev , recipients , messages : [...prev.messages , message]} 
        })
    }

    const recieveMessage = useCallback(({recipients , message})=>{
      
            addRecievedMessageToDiscussion(recipients , message)
        
    },[])
   
    useEffect(()=>{
        if(socket == null) return
        socket.on('recieve-message' , recieveMessage)

        return ()=>socket.off('recieve-message')
    },[socket ])

    function addRecievedMessageToDiscussion(recipients , message){
      
        let fetched = fetchDiscussion(recipients)
        if(fetched){
            console.log('this should run second')    
            setDiscussions((prev)=>{
                prev.forEach((discussion)=>{
                    if(compareArrays(discussion.recipients , recipients)){
                        discussion.messages.push(message)
                    }
                })
            
                return [...prev]
            })
        }
        else{
            setDiscussions((prev)=>{
                let newDiscussions = prev
                newDiscussions.push({recipients:recipients , messages:[message]})
                return [...newDiscussions]
            })
        }
    }

    function openNewDiscussion(recipients){
        if(activeDiscussion && (compareArrays(activeDiscussion.recipients , recipients))){
             return
        }
        let oldDiscussion = fetchDiscussion(recipients)
        if(oldDiscussion) {
            setActiveDiscussion(oldDiscussion)
        }else{
            setActiveDiscussion({recipients , messages:[]})
        }       
    }

    function compareArrays(a , b){
      
        if(a.length != b.length) return false
        a.sort((a , b)=>{
            return a.id < b.id
        })
        b.sort((a , b)=>{
            return a.id < b.id
        })
        let result = a.every((item , index)=>{
            return item.id == b[index].id
        }) 
        return result
    }

    function fetchDiscussion(recipients){
        let fetched = discussions.find((discussion)=>{
            return compareArrays(discussion.recipients , recipients)  
        })
        // console.log(recipients)
        // console.log(fetched)
        if(!fetched ) return false
        return fetched 
    }

    return (
        <DiscussionsContext.Provider value={{discussions , activeDiscussion , openNewDiscussion , addMessageToDiscussion , fetchDiscussion }}>
            {children}
        </DiscussionsContext.Provider>
  )
}
