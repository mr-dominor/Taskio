"use server"
import { auth } from "@clerk/nextjs/server"
import { InputType, Returntype } from "./type"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createSafeState } from "@/lib/create-safe-state"
import { CopyCard } from "./schema"
import { createAuditLog } from "@/lib/create-audit-log"
import { ENTITY_TYPE ,ACTION} from "@prisma/client"

const handler = async(data:InputType):Promise<Returntype> =>{
    const {orgId, userId} = await auth()
    if(!orgId || !userId){
        return{error:"Not authorized"}
    }
    const {id,boardId} = data;
    let card;
    try {
        const cardToCopy = await prisma.card.findUnique({
            where: {
                id,
                list:{
                    board:{orgId}
                }
            }
        })

        if(!cardToCopy) {
            return {error: "Card does not exist"}
        }

        const lastCard = await prisma.card.findFirst({
            where:{listId:cardToCopy.listId},
            orderBy:{order:"desc"},
            select:{order:true}
        })
        const newOrder = lastCard?lastCard.order+1 :1;
        card = await prisma.card.create({
            data:{
                title:`${cardToCopy.title}-Copy`,
                description:cardToCopy.description,
                order:newOrder,
                listId:cardToCopy.listId
            },
        })
        await createAuditLog({
            entityTitle: card.title,
            entityId:card.id,
            entityType:ENTITY_TYPE.CARD,
            action:ACTION.CREATE
        })
    } catch (error) {
        return{error:"Failed to copy"}
    }
    revalidatePath(`board/${boardId}`);

    return {data:card}
}

export const copyCard = createSafeState(CopyCard,handler)