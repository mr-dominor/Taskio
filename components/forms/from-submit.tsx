"use client"

import { useFormStatus } from "react-dom"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

interface FormSubmitProps {
    children: React.ReactNode;
    disabled?:boolean;
    className?:string;
    variant?:"default" | "outline" | "secondary" | "ghost" | "link" | "primary";
}

export const FormSubmit = ({children, disabled, className,variant}:FormSubmitProps) =>{
    const {pending} = useFormStatus();
    return(
        <Button
        disabled={pending}
        className={cn(className)}
        variant={variant}
        size={"sm"}
        >{children}</Button>
    )
}