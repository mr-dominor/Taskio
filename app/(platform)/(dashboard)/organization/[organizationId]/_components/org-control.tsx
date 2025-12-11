"use client"
import { useOrganizationList } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export const OrgControl = () =>{

    const {setActive} = useOrganizationList()
    const params = useParams();
    useEffect(()=>{
        if(!setActive) return ;
        setActive({
            organization: params.organizationId as string,
        })
    },[params.organizationId, setActive])
    return null;
}