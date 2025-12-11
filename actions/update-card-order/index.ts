"use server"
import { createSafeState } from "@/lib/create-safe-state";
import { InputType, ReturnType } from "./type";
import { UpdateCardOrder } from "./schema";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async(data:InputType):Promise<ReturnType> => {
    const {orgId, userId} = await auth();
    if(!orgId || !userId) {return{error:"Unauthorized error"}}
    const {items, boardId} = data;
    let updatedcards;
    try {
        const transaction = items.map((card)=>
        prisma.card.update({
            where:{
                id:card.id,
                list:{
                    board:{
                        orgId
                    },
                },
            },
            data:{
                order:card.order,
                listId:card.listId,
            },
        })
      )
      updatedcards = await prisma.$transaction(transaction)
    } catch (error) {
        return{
            error:"Failed to Reorder"
        }
    }
    revalidatePath(`/board/${boardId}`)
    return {data:updatedcards}
}

export const updateCardOrder = createSafeState(UpdateCardOrder,handler)