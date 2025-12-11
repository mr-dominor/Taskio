"use server"
import { createSafeState } from "@/lib/create-safe-state";
import { InputType, ReturnType } from "./type";
import { CreateCard } from "./schema";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async(data:InputType):Promise<ReturnType> => {
    const {orgId, userId} = await auth();
    if(!orgId || !userId) {return{error:"Unauthorized error"}}
    const {title, boardId, listId} = data;
    let card;
    try {
        const list = await prisma.list.findUnique({
            where:{
                id:listId,
                board:{orgId}
            }
        });

        if(!list){
            return{error:"List not found"}
        }

        const lastCard = await prisma.card.findFirst({
            where:{listId},
            orderBy:{order:"desc"},
            select:{order:true}
        });

        const newOrder = lastCard ? lastCard.order+1:1;

        card = await prisma.card.create({
            data:{
                title,
                listId,
                order:newOrder
            }
        })
        
        await createAuditLog({
            entityId: card.id,
            entityTitle:card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE,
        })
    } catch (error) {
        return{
            error:"Failed to Create List"
        }
    }
    revalidatePath(`/board/${boardId}`)
    return {data:card}
}

export const createCard = createSafeState(CreateCard,handler)