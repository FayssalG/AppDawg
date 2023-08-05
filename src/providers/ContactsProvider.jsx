import React , {useContext ,useState, createContext} from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const ContactsContext = createContext()
export function useContacts(){
    return useContext(ContactsContext)
}
export default function ContactsProvider({children}) {
    const [contacts , setContacts] = useLocalStorage('contacts' , [])
    
    
    function addContact(contactId , contactName){
        setContacts((prev)=>{
            return [...prev , {id:contactId , name:contactName}]
        })
    }

    function deleteContact(contactId){
        setContacts((prev)=>{
            return prev.filter((contact)=>{
                return contact.id != contactId
            })
        })
    }
     
    function renameContact(contactId , newName){
        let newContacts = [...contacts]
        newContacts.forEach((contact)=>{
            if(contact.id == contactId){
                contact.name = newName
            }
        })
        setContacts(newContacts)
    }
    return (
    <ContactsContext.Provider value={{contacts , addContact , deleteContact , renameContact}}>
        {children}
    </ContactsContext.Provider>
  )
}
