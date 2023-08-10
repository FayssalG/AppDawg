import { useEffect, useReducer } from "react";

const PREFIX = 'updawg-'
export default function useLocalStorageReducer(key ,reducer , initialState){
    const prefixKey = PREFIX+key
    const [value , dispatch] = useReducer(reducer , ()=>{
        let storedItem = localStorage.getItem(prefixKey)
        if(storedItem != null){
            return JSON.parse(storedItem)
        }
        if(typeof initialState === 'function' ){
            return initialState()
        }
        else{
            return initialState
        }
    })

    useEffect(()=>{
        if(value) localStorage.setItem(prefixKey , JSON.stringify(value))
    },[prefixKey , value])
    return [value , dispatch]
}