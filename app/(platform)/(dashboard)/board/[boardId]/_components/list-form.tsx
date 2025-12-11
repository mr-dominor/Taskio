"use client"

import { Plus, X } from "lucide-react"
import { ListWrapper } from "./list-wrapper"
import { useState, useRef, ElementRef } from "react"
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import { FormInput } from "@/components/forms/form-input"
import { FormSubmit } from "@/components/forms/from-submit"
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-actions"
import { createList } from "@/actions/create-list"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
export const ListForm = ({boardId}:{boardId:string}) =>{
    const[isEditing, setIsEditing] = useState(false)
    const formRef = useRef<ElementRef<"form">>(null)
    const inputRef = useRef<ElementRef<"input">>(null)
    const router = useRouter()
    const enableEditing = () =>{
        setIsEditing(true);
        setTimeout(()=>{
            inputRef.current?.focus();
        })
    }

    const disableEditing = () =>{
        setIsEditing(false)
    }

    const {execute, fieldError} = useAction(createList,{
        onSuccess:(data)=>{
            toast.success(`Created ${data.title}`);
            disableEditing()
            router.refresh()
        },
        onError:(error)=>{
            toast.error(error)
        }
    })

    const onSubmit = (formData:FormData) =>{
        const title = formData.get("title") as string;
        const boardId = formData.get("boardId") as string;
        execute({title, boardId});
    }

    const onkeyDown = (e:KeyboardEvent) =>{
        if(e.key === "Escape"){
            disableEditing()
        }
    }

    useEventListener("keydown",onkeyDown);
    useOnClickOutside(formRef, disableEditing);

    if(isEditing) {
        return (
            <ListWrapper>
                <form action={onSubmit} ref={formRef} className="w-full p-3 rounded-md bg-white space-y-4 shadow-md">
                    <FormInput ref={inputRef} id="title" classname="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition" placeholder="Enter the title..." errors={fieldError} />
                    <div className="flex items-center gap-x-1">
                        <input hidden value={boardId} name="boardId" readOnly />
                        <FormSubmit>
                            Add a list
                        </FormSubmit>
                        <Button onClick={disableEditing} size={"sm"} variant={"ghost"}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </form>
            </ListWrapper>
        )
    }
    return(
        <ListWrapper>
            <button onClick={enableEditing} className="w-full p-3 rounded-md bg-white/80 hover:bg-white/50 transition items-center font-medium text-sm">
                <Plus />
                Add a list
            </button>
        </ListWrapper>
    )
}