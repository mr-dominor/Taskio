
"use client"

import { FormInput } from "@/components/forms/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types"
import { Layout } from "lucide-react";
import { ElementRef, useRef,useState } from "react";
import { useParams } from "next/navigation";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useAction } from "@/hooks/use-actions";
import { updateCard } from "@/actions/update-card";
import { toast } from "sonner";

interface headerProps {
    data:CardWithList;
}
export const Header = ({data}:headerProps)=>{
    const [title,setTitle] = useState(data?.title)
    const queryClient = useQueryClient();
    const params = useParams();
    const inputRef = useRef<ElementRef<"input">>(null);
    const {execute} = useAction(updateCard,{
        onSuccess:(data)=>{
            queryClient.invalidateQueries({
                queryKey: ["card",data.id]
            });

            queryClient.invalidateQueries({
                queryKey: ["card-logs",data.id]
            });

            toast.success(`Card title renamed to ${data}`)
        },
        onError:(error)=>{
            toast.error(error)
        }
    })
    const onBlur = () =>{
        inputRef.current?.form?.requestSubmit()
    }

    const onSubmit = (formData:FormData) => { 
        const title = formData.get("title") as string;
        const boardId = params.boardId as string;
        if(title === data.title) {
            return;
        }
        execute({title,boardId, id:data.id})
    }
    return(
        <div>
            <Layout className="h-5 w-5 mt-1 text-neutral-700" />
            <div className="w-full">
                <form action={onSubmit}>
                    <FormInput ref={inputRef} onBlur={onBlur} id="title" defaultValue={title} classname="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate" />
                </form>
                <p className="text-sm text-muted-foreground">
                    in list <span className="underline ">{data.list.title}</span>
                </p>
            </div>
        </div>
    )
}

Header.Skeleton = function HeaderSkeleton() {
    return(
        <div className="flex items-start gap-x-3 mb-6">
            <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
            <div>
                <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
                <Skeleton className="w-12 h-4 mb-1 bg-neutral-200" />
            </div>
        </div>
    )
}