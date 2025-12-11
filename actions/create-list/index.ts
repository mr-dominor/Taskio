"use server"
import { createSafeState } from "@/lib/create-safe-state";
import { InputType, ReturnType } from "./type";
import { CreateList } from "./schema";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async(data:InputType):Promise<ReturnType> => {
    const {orgId, userId} = await auth();
    if(!orgId || !userId) {return{error:"Unauthorized error"}}
    const {title, boardId} = data;
    console.log("From backend------>",data)
    let list;
    try {
        const board = await prisma.board.findUnique({
            where:{
                id:boardId,
                orgId
            }
        })
        if(!board){
            return{
                error:"Not Authorized"
            }
        }

        const lastList = await prisma.list.findFirst({
            where:{boardId:boardId},
            orderBy:{order:"desc"},
            select:{order:true}
        })
        const newOrder = lastList ? lastList.order+1:1
        list = await prisma.list.create({
            data:{
                title,
                boardId,
                order:newOrder,
            }
        })
        await createAuditLog({
                    entityTitle: list.title,
                    entityId:list.id,
                    entityType:ENTITY_TYPE.LIST,
                    action:ACTION.CREATE
                })
    } catch (error) {
        return{
            error:"Failed to Create List"
        }
    }
    revalidatePath(`/board/${boardId}`)
    return {data:list}
}

export const createList = createSafeState(CreateList,handler)