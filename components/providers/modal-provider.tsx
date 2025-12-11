"use client"

import { CardModal } from "../modals/card-modal"
import { ProModal } from "../modals/card-modal/pro-modal"
import { useEffect, useState } from "react"

export const ModalProvider = () =>{
    const [isMounted, setIsMounted] = useState(false)

    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true)
    },[])

    if(!isMounted){
        return null;
    }
    return (
        <>
        <CardModal />
        <ProModal />
        </>
    )
}