"use client"

import { FormSubmit } from "@/components/forms/from-submit";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-actions";
import { List } from "@prisma/client"
import { Popover,PopoverContent,PopoverTrigger, PopoverClose } from "@/components/ui/popover";
import { MoreHorizontal, X } from "lucide-react";
import { deleteList } from "@/actions/delete-list";
import { copyList } from "@/actions/copy-list";
import { toast } from "sonner";
import { ElementRef, useRef } from "react";
interface ListOptionsProps {
    data:List;
    onAddCard:()=>void;
}

export const ListOptions = ({data,onAddCard}:ListOptionsProps)=>{
    const closeRef = useRef<ElementRef<"button">>(null);
    const {execute} = useAction(deleteList,{
        onSuccess:()=>{
            toast.success("List deleted")
            closeRef.current?.click()
        },
        onError:(error)=>{
            toast.error(error)
        }
    })

    const {execute:executeCopy} = useAction(copyList,{
        onSuccess:(data)=>{
            toast.success(`List ${data.title} copied`)
            closeRef.current?.click()
        },
        onError:(error)=>{
            toast.error(error)
        }
    })

    const handleDeleteList = (formData:FormData) =>{
        const id = formData.get("id") as string
        const boardId = formData.get("boardId") as string
        execute({id,boardId})
    }

    const handleUpdateList = (formData:FormData) =>{
        const id = formData.get("id") as string
        const boardId = formData.get("boardId") as string
        executeCopy({id,boardId})
    }
    return(
        <Popover>
            <PopoverTrigger asChild>
                <Button className="w-auto h-auto p-2" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="px-0 pt-3 pb-3 bg-white rounded-md w-48" side="bottom" align="start">
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    List Actions
                </div>
            <PopoverClose asChild>
                <Button ref={closeRef} className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
                    <X className="h-4 w-4" />
                </Button>
            </PopoverClose>
            <Button onClick={onAddCard} className="rounded-none w-full h-auto px-5 justify-start font-normal text-sm" variant={"ghost"} >
                Add card...
            </Button>
            <form action={handleUpdateList}>
                <input hidden readOnly name="id" id="id" value={data.id} />
                <input hidden readOnly name="boardId" id="boardId" value={data.boardId} />
                <FormSubmit variant="ghost" className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm">
                    Copy list...
                </FormSubmit>
            </form>
            <Separator />
            <form action={handleDeleteList}>
                <input hidden readOnly name="id" id="id" value={data.id} />
                <input hidden readOnly name="boardId" id="boardId" value={data.boardId} />
                <FormSubmit variant="ghost" className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm">
                    Delete list...
                </FormSubmit>
            </form>
            </PopoverContent>
        </Popover>
    )
}