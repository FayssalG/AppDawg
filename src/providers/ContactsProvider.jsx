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
    return (
    <ContactsContext.Provider value={{contacts , addContact}}>
        {children}
    </ContactsContext.Provider>
  )
}
