"use server"
import { auth } from "@clerk/nextjs/server"
import { InputType, Returntype } from "./type"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createSafeState } from "@/lib/create-safe-state"
import { DeleteCard } from "./schema"
import { createAuditLog } from "@/lib/create-audit-log"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
const handler = async(data:InputType):Promise<Returntype> =>{
    const {orgId, userId} = await auth()
    if(!orgId || !userId){
        return{error:"Not authorized"}
    }
    const {id,boardId} = data;
    let card;
    try {
        card = await prisma.card.delete({
            where:{
                id,
                list:{
                    board:{
                        orgId
                    }
                }
            }
        })
        await createAuditLog({
            entityTitle: card.title,
            entityId:card.id,
            entityType:ENTITY_TYPE.CARD,
            action:ACTION.DELETE
        })
    } catch (error) {
        return{error:"Failed to delete"}
    }
    revalidatePath(`board/${boardId}`);

    return {data:card}
}

export const deleteCard = createSafeState(DeleteCard,handler)