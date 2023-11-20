import React , {useContext ,useState, createContext} from 'react'
import { useUser } from './UserProvider'
import useLocalStorage from '../hooks/useLocalStorage'

const ContactsContext = createContext()
export function useContacts(){
    return useContext(ContactsContext)
}
export default function ContactsProvider({children}) {
    const {user} = useUser()
    const [contacts , setContacts] = useLocalStorage('contacts-'+user.uid , [])
    
    
    function addContact(contactId , contactName , setError){
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
