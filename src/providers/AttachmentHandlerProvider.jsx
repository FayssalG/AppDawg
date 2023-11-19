import { createContext , useContext, useEffect, useState } from "react"
import Compressor from 'compressorjs';



const AttachmentHandlerContext = createContext()
export function useAttachmentHandler(){
  return useContext(AttachmentHandlerContext)
}

export default function AttachmentHandlerProvider({children}) {
  const [currentAttachment , setCurrentAttachment] = useState(null)

  function addAttachment(attachment){
    if(attachment){
      //Check if the attachment is an image and compress it
      if(attachment.type.split('/')[0] == 'image'){
        new Compressor(attachment, {
          quality:0.5,
          success:(result)=>{
            setCurrentAttachment(result)
          }
        })
      }   

    }else{
      setCurrentAttachment(null)
    }
  }
  return (
    <AttachmentHandlerContext.Provider value={{currentAttachment , addAttachment}}>
      {children}
    </AttachmentHandlerContext.Provider>
  )
}
