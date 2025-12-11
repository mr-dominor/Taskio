"use server"
import { createSafeState } from "@/lib/create-safe-state";
import { InputType, ReturnType } from "./type";
import { UpdateList } from "./schema";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async(data:InputType):Promise<ReturnType> => {
    const {orgId, userId} = await auth();
    if(!orgId || !userId) {return{error:"Unauthorized error"}}
    const {title, boardId, id} = data;
    console.log("From backend------>",data)
    let list;
    try {
 
        list = await prisma.list.update({
            where:{id,boardId, board:{orgId},},
            data:{title,}
        })

        await createAuditLog({
            entityTitle: list.title,
            entityId:list.id,
            entityType:ENTITY_TYPE.LIST,
            action:ACTION.UPDATE
        })
    } catch (error) {
        return{
            error:"Failed to Create List"
        }
    }
    revalidatePath(`/board/${boardId}`)
    return {data:list}
}

export const updateList = createSafeState(UpdateList,handler)