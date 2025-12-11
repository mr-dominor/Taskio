import {create} from 'zustand'


type MobileSideBar = {
    isOpen:boolean,
    onOpen:()=>void,
    onClose:()=>void
}
export const useSideBar = create<MobileSideBar>((set)=>({
    isOpen:false,
    onOpen:()=>set({isOpen:true}),
    onClose:()=>set({isOpen:false})
}))