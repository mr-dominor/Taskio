"use client"

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"
import { CardWithList } from "@/types"
import { Copy, Trash } from "lucide-react";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { useAction} from "@/hooks/use-actions";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useCardModal } from "@/hooks/use-card-modal";
interface ActionsProps {
    data:CardWithList;
}

export const Actions = ({data}:ActionsProps) =>{
    const params = useParams();
    const cardmodal = useCardModal();
    const {execute:executeCopy, isLoading:copiedLoading} = useAction(copyCard,{
        onSuccess:(data)=>{
            toast.success(`card ${data.title} copied`)
            cardmodal.onClose()
        },
        onError:(error)=>{
            toast.error(error)
        }
    })
    const {execute:executeDelete , isLoading:deletableLoading} = useAction(deleteCard,{
        onSuccess:(data)=>{
            toast.success(`card ${data.title} deleted`)
            cardmodal.onClose()
        },
        onError:(error)=>{
            toast.error(error)
        }
    })
    const onCopy = () =>{
        const boardId = params.boardId as string
        executeCopy({id:data.id , boardId})
    }
    const onDelete = () =>{
        const boardId = params.boardId as string
        executeDelete({id:data.id , boardId})
    }

    return(
        <div className="space-y-2 mt-2">
            <p className="text-xs font-semibold">
                Actions
            </p>
            <Button
            onClick={onCopy}
            disabled={copiedLoading}
            variant="gray"
            className="w-full justify-start"
            size={"inline"}
            >
                <Copy className="h-4 w-4 mr-2" />
                Copy
            </Button>
            <Button
            onClick={onDelete}
            disabled={deletableLoading}
            variant="gray"
            className="w-full justify-start"
            size={"inline"}
            >
                <Trash className="h-4 w-4 mr-2" />
                Delete
            </Button>
        </div>
    )
}

Actions.Skeleton = function ActionsSkeleton(){
    return(
        <div className="space-y-2 mt-2 ">
            <Skeleton className="w-20 h-4 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
        </div>
    )
}