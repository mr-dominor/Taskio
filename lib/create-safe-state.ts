import {z} from "zod"
export type FieldError<T>={
    [K in keyof T]: string[]
}

export type ActionState<TInput, TOutput>={
    fieldError?:FieldError<TInput>,
    error?:string
    data?:TOutput
}

export const createSafeState=<TInput, TOutput>(schema:z.Schema<TInput>, handler:(validateData:TInput)=>Promise<ActionState<TInput,TOutput>>) =>{
    return async(data:TInput):Promise<ActionState<TInput,TOutput>>=>{
        const validatedData = schema.safeParse(data)
        if(!validatedData.success){
            return {
                fieldError: validatedData.error.flatten().fieldErrors as FieldError<TInput>
            }
        }
        return handler(validatedData?.data)
    }
}