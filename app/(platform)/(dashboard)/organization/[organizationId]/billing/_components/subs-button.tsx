"use client";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-actions";
import { toast } from "sonner";
import { useProModal } from "@/hooks/use-pro-modal";

interface subscriptionButtonProps{
    isPro:boolean;
}
export const SubsriptionButton = ({isPro}:subscriptionButtonProps) =>{
    const {execute, isLoading} = useAction(stripeRedirect,{
        onSuccess:(data)=>{
            window.location.href = data;
        },
        onError:(error)=>{
            toast.error(error)
        }
    });

    const proModal = useProModal()

    const onClick = () =>{
        if(isPro){
            execute({});
        }else{
            proModal.onOpen();
        }
    }
    return(
        <Button variant={"primary"} disabled={isLoading} onClick={onClick}>
            {isPro ? "Manage subscription":"Upgrade to pro"}
        </Button>
    )
}