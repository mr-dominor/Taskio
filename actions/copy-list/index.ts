"use server"
import { auth } from "@clerk/nextjs/server"
import { InputType, Returntype } from "./type"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createSafeState } from "@/lib/create-safe-state"
import { CopyList } from "./schema"
import { createAuditLog } from "@/lib/create-audit-log"
import { ENTITY_TYPE, ACTION } from "@prisma/client"
const handler = async(data:InputType):Promise<Returntype> =>{
    const {orgId, userId} = await auth()
    if(!orgId || !userId){
        return{error:"Not authorized"}
    }
    const {id,boardId} = data;
    let list;
    try {
        const listToCopy = await prisma.list.findUnique({
            where:{
                id,boardId,board:{orgId,}
            },
            include:{cards:true}
        })
        if(!listToCopy){
            return {error:"List to copy not found"}
        }

        const lastList = await prisma.list.findFirst({
            where:{boardId},
            orderBy:{order:"desc"},
            select:{order:true},
        });

        const newOrder = lastList ? lastList.order +1 :1;

        list = await prisma.list.create({
            data:{
                boardId:listToCopy.boardId,
                title:`${listToCopy.title}-Copy`,
                order:newOrder,
                cards:{
                    createMany:{
                        data:listToCopy.cards.map((card)=>({
                            title:card.title,
                            description:card.description,
                            order:card.order
                        })),
                    }
                }
            },
            include:{
                cards:true,
            }
        });
        await createAuditLog({
                    entityTitle: list.title,
                    entityId:list.id,
                    entityType:ENTITY_TYPE.LIST,
                    action:ACTION.CREATE
                })
    } catch (error) {
        return{error:"Failed to copy"}
    }
    revalidatePath(`board/${boardId}`);

    return {data:list}
}

export const copyList = createSafeState(CopyList,handler)