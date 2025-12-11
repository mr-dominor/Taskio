"use cleint"

import { FormTextarea } from "@/components/forms/form-textarea";
import { FormSubmit } from "@/components/forms/from-submit";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { forwardRef, useRef, ElementRef, KeyboardEvent, KeyboardEventHandler } from "react";
import { useAction } from "@/hooks/use-actions";
import { useParams } from "next/navigation";
import { createCard } from "@/actions/create-card";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { toast } from "sonner";

interface CardFormProps {
    listId:string;
    enableEditing:()=>void;
    disableEditing:()=>void;
    isEditing:boolean;
}
export const CardForm = forwardRef<HTMLTextAreaElement,CardFormProps>(({listId,isEditing,enableEditing,disableEditing },ref) =>{
    const params = useParams()
    const formRef = useRef<ElementRef<"form">>(null)

    const {execute,fieldError} = useAction(createCard,{
        onSuccess:(data)=>{
            toast.success(`Card with title ${data.title} is created`);
            formRef.current?.reset()
        }
    });

    const onKeyDown = (e:KeyboardEvent) =>{
        if(e.key === "Escape"){
            disableEditing();
        }
    };

    useOnClickOutside(formRef,disableEditing);
    //useEventListener("keydown",onKeyDown);

    const onTextareaKeyDown:KeyboardEventHandler<HTMLTextAreaElement> = (e)=>{
        if(e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit()
        }
    }

    const onSubmit = (formData:FormData) =>{
        const title = formData.get("title") as string;
        const boardId = params.boardId as string
        const listId = formData.get("listId") as string;

        console.log("from card-form",title, boardId, listId )
        execute({title, boardId, listId})
    }

    if(isEditing){
        return(
            <form action={onSubmit} ref={formRef} className="p-1">
                <FormTextarea id="title" onKeyDown={onTextareaKeyDown} ref={ref} errors={fieldError} placeholder="Enter a title for this card..." />
                <input hidden readOnly id="litId" name="listId" value={listId} />
                 <div className="flex items-center gap-x-1 p-1">
                    <FormSubmit variant={"primary"}>
                        Add card
                    </FormSubmit>
                    <Button onClick={disableEditing} size="sm" variant="ghost">
                        <X className="h-5 w-5" />
                    </Button>
                 </div>
            </form>
        )
    }
    return (
        <div className="pt-2 px-2">
            <Button 
            onClick={enableEditing}
            className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
            size={"sm"}
            variant={"ghost"}
            >
                <Plus className="h-4 w-4" />
                Add a card
            </Button>
        </div>
    )
})

CardForm.displayName = "cardForm"