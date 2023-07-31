import React, { useEffect , useState} from 'react'

const PREFIX = 'updawg-'
export default function useLocalStorage(key , initialState) {
    const prefixkey = PREFIX + key
    const [value , setValue] = useState(()=>{
        let storedItem = localStorage.getItem(prefixkey)
        if(storedItem != null){
            return JSON.parse(storedItem)
        }
        if(typeof initialState === 'function') {
            return initialState()
        }else{
            return initialState
        }
    })
    useEffect(()=>{
        if(value) localStorage.setItem(prefixkey , JSON.stringify(value))
    },[prefixkey , value])

    return [value , setValue]
}
