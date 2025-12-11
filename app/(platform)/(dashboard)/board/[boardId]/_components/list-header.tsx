"use client"

import { updateList } from "@/actions/update-list";
import { FormInput } from "@/components/forms/form-input";
import { useAction } from "@/hooks/use-actions";
import { List } from "@prisma/client"
import { ElementRef, useRef, useState } from "react"
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { ListOptions } from "./list-options";

interface ListHeaderProps {
    data:List,
    onAddCard:()=>void
}
export const  ListHeader = ({data, onAddCard}:ListHeaderProps) =>{
    const [title,setTitle] = useState(data.title);
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);
    const [isEditing, setIsEditing] = useState(false)

    const enableEditing = () =>{
        setIsEditing(true)
        setTimeout(()=>{
            inputRef.current?.focus()
            inputRef.current?.select()
        })
    }

    const disableEditing = () =>{
        setIsEditing(false)
    }

    const {execute} = useAction(updateList,{
        onSuccess:(data)=>{
            toast.success("List Updated")
            setTitle(data.title)
            disableEditing()
        },
        onError:(error)=>{
            toast.error(error)
        }
    })
    const onkeyDown = (e:KeyboardEvent) =>{
        if(e.key === "Escape"){
            disableEditing()
        } 
    }

    const handleSubmit = (formData:FormData) =>{
        const id = formData.get("id") as string
        const title = formData.get("title") as string
        const boardId = formData.get("boardId") as string

        if(title === data.title){
            return disableEditing();
        }
        execute({id,title,boardId})
    }
    const onBlur = () =>{
        formRef.current?.requestSubmit()
    }
    useEventListener("keydown",onkeyDown)
    useOnClickOutside(formRef,disableEditing)

    return(
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
            {
                isEditing?(
                    <form  ref={formRef} action={handleSubmit} className="flex-1 px-[2px]">
                        <input hidden readOnly id="id" name="id" value={data.id} />
                        <input hidden readOnly id="boardId" name="boardId" value={data.boardId} />
                        <FormInput id="title" ref={inputRef} onBlur={onBlur} placeholder="Enter list title..." classname="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white" />
                        <button type="submit" hidden />
                    </form>
                 ):(<div className="w-full text-sm px-2.5  py-1 h-7 font-medium border-transparent" onClick={enableEditing}>
                {title}
            </div>)
            }
            <ListOptions data={data} onAddCard={onAddCard} />
        </div>
    )
}