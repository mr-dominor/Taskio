"use server"
import { createSafeState } from "@/lib/create-safe-state";
import { InputType, ReturnType } from "./type";
import { UpdateListOrder } from "./schema";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const handler = async(data:InputType):Promise<ReturnType> => {
    const {orgId, userId} = await auth();
    if(!orgId || !userId) {return{error:"Unauthorized error"}}
    const {items, boardId} = data;
    let lists;
    try {
        const transaction = items.map((list)=>
        prisma.list.update({
            where:{
                id:list.id,
                board:{
                    orgId,
                },
            },
            data:{
                order:list.order,
            },
        })
      )
      lists = await prisma.$transaction(transaction)
    } catch (error) {
        return{
            error:"Failed to Reorder"
        }
    }
    revalidatePath(`/board/${boardId}`)
    return {data:lists}
}

export const updateListOrder = createSafeState(UpdateListOrder,handler)