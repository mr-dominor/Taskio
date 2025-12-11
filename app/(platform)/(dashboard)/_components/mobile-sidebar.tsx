 /* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import {useSideBar} from "@/hooks/side-bar-state"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import SideBar from "./side-bar"
const MobileSideBar = () =>{
    const isOpen = useSideBar((state)=>state.isOpen)
    const onOpen = useSideBar((state)=>state.onOpen)
    const onClose = useSideBar((state)=>state.onClose)
    const pathname = usePathname()
    const [isMounted, setIsMounted] = useState(false);

  useEffect(()=>{
    setIsMounted(true)
  },[])
  useEffect(()=>{
    onClose()
  },[onClose,pathname])

    if(!isMounted) return null;
    return(
        <>
        <Button
        variant={"ghost"}
        size={"sm"}
        onClick={onOpen}
        >
            <Menu className="w-4 h-4" />
        </Button>
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="left" className="pt-20 pl-2 pr-2">
                <SideBar storageKey="t-sidebar-mobile-state" />
            </SheetContent>
        </Sheet>
        </>
    )
}

export default MobileSideBar