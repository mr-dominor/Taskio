/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import {useLocalStorage} from "usehooks-ts"
import { Plus } from "lucide-react";
import Link from "next/link";
import { NavItems } from "./nav-items";
interface sideBarProps {
    storageKey?:string
}
const SideBar = ({storageKey = "t-sidebar-state"}:sideBarProps) => {
    const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(storageKey,{});
    const {isLoaded:isLoadedOrg, organization:activeOrganization} = useOrganization()
    const {isLoaded:isLoadedOrgList, userMemberships} = useOrganizationList({
  userMemberships: { infinite: true },
})

    const defaultAccordionValue: string[] = Object.keys(expanded).reduce((acc:string[],key:string)=>{
        if(expanded[key]){
            acc.push(key)
        }
        return acc;
    },[]);

    const onExpanded = (id:string) =>{
        setExpanded((curr)=>({
            ...curr,
            [id]:!expanded[id]
        }))
    }

    if(!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading){
        return(
            <>
            <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-10 w-[50%]"/>
                <Skeleton className="h-10 w-10"/>
            </div>
            <div className="space-y-2">
                <NavItems.Skeleton />
                <NavItems.Skeleton />
                <NavItems.Skeleton />
                <NavItems.Skeleton />
            </div>
            </>
        )
    }
    return(
        <>
        <div className="font-medium text-xs flex items-center mb-1">
            <span className="pl-4">Workspaces</span>
            <Button asChild type="button" size='icon' variant="ghost" className="ml-auto"><Link href={'/select-org'}><Plus className="h-4 w-4" /></Link></Button>
        </div>
       <Accordion
       type="multiple"
       defaultValue={defaultAccordionValue}
       className="space-y-2"
       >
        {userMemberships.data.map((m)=>{
            if(!m) return null;
            const org = m.organization
            return(<div key={`${org.id}-${org.createdAt}`}>
                <NavItems 
                isActive={org?.id === activeOrganization?.id}
                isExpanded={expanded[org.id]}
                onExpanded={onExpanded}
                organization={{
                    id:org.id,
                    name:org.name,
                    imageUrl:org.imageUrl,
                    slug:org.slug
                }
                }
                />
            </div>)
})}
       </Accordion>
        </>
    )
}

export default SideBar