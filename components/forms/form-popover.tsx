"use client"

import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "../ui/popover";
import { useAction } from "@/hooks/use-actions";

import { FormInput } from "./form-input";
import { FormSubmit } from "./from-submit";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { createBoard } from "@/actions/create-board";
import { toast } from "sonner";
import { FormPicker } from "./form-picker";
import { ElementRef, useRef } from "react";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-modal";

interface FormPopoverProps {
    children: React.ReactNode;
    side?:"left" | "right" | "top" | "bottom"
    align?:"start" | "center" | "end"
    sideOffset?:number
}

export const FormPopover = ({
    children,
    side="bottom",
    align,
    sideOffset=0,
}:FormPopoverProps)=>{
    const closeRef = useRef<ElementRef<"button">>(null)
    const router = useRouter();
    const proModal = useProModal();
    const {execute, fieldError} = useAction(createBoard,{
        onSuccess:(data) =>{
            console.log("Data is ========",data)
            toast.success("Board Created!")
            closeRef.current?.click()
            router.push(`/board/${data.id}`);
        },
        onError:(error)=>{
            toast.error(error)
            proModal.onOpen()
        }
    });

    const onSubmit = (formData:FormData)=>{
        const title = formData.get("title") as string;
        const image = formData.get("image") as string;
        execute({title,image})
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent align={align} className="w-80 pt-3" sideOffset={sideOffset} side={side}>
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">Crreate board</div>
                <PopoverClose asChild ref={closeRef}>
                    <Button asChild className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant={"ghost"}>
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <form action={onSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <FormPicker id="image" errors={fieldError} />
                        <FormInput id="title" label="Board title" type="text" errors={fieldError} />
                    </div>
                    <FormSubmit className="w-full">
                        Create
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}