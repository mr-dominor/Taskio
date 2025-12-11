/* eslint-disable react/display-name */
"use client"

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-error";

interface FormInputProps{
    id:string;
    label?:string;
    type?:string;
    placeholder?:string;
    required?:boolean;
    disabled?:boolean;
    errors?:Record<string, string[] | undefined>;
    classname?:string;
    defaultValue?:string;
    onBlur?: ()=> void;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
    id,label,type,placeholder, required, disabled, errors,classname,defaultValue,onBlur},ref)=>{
    const {pending} = useFormStatus();
    return(
        <div className="space-y-2">
            <div className="space-y-1">
                {
                    label?(<Label>{label}</Label>):null
                }
                <Input
                onBlur={onBlur}
                defaultValue={defaultValue}
                ref={ref}
                required={required}
                name={id}
                id={id}
                placeholder={placeholder}
                type={type}
                disabled={disabled}
                className={cn("text-sm px-2 py-1 h-7",classname)}
                aria-describedby={`${id}-error`}
                 />
            </div>
            <FormErrors id={id} errors={errors} />
        </div>
    )
})