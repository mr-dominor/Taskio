"use server"
import { createSafeState } from "@/lib/create-safe-state";
import { InputTye, ReturnType } from "./type";
import { UpdateCard } from "./schema";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async(data:InputTye):Promise<ReturnType>=>{
    const {orgId,userId} = await auth()
    if(!userId || !orgId){
        return {
            error:"Unauthorized error"
        }
    }

    const {id, boardId, ...values} = data;
    let card;
    try {
        card = await prisma.card.update({
            where:{
                id,
                list:{
                    board:{orgId}
                }
            },
            data:{
                ...values
            }
        })
        await createAuditLog({
            entityTitle: card.title,
            entityId:card.id,
            entityType:ENTITY_TYPE.CARD,
            action:ACTION.UPDATE
        })
    } catch (error) {
        return{
            error:"Failed to update"
        }
    }
    revalidatePath(`/board/${boardId}`)
    return {data:card};
}

export const updateCard = createSafeState(UpdateCard,handler)