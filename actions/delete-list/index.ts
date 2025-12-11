"use server"
import { auth } from "@clerk/nextjs/server"
import { InputType, Returntype } from "./type"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createSafeState } from "@/lib/create-safe-state"
import { DeleteList } from "./schema"
import { createAuditLog } from "@/lib/create-audit-log"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
const handler = async(data:InputType):Promise<Returntype> =>{
    const {orgId, userId} = await auth()
    if(!orgId || !userId){
        return{error:"Not authorized"}
    }
    const {id,boardId} = data;
    let list;
    try {
        list = await prisma.list.delete({
            where:{id, boardId, board:{orgId}}
        })
        await createAuditLog({
            entityTitle: list.title,
            entityId:list.id,
            entityType:ENTITY_TYPE.LIST,
            action:ACTION.DELETE
        })
    } catch (error) {
        return{error:"Failed to delete"}
    }
    revalidatePath(`board/${boardId}`);

    return {data:list}
}

export const deleteList = createSafeState(DeleteList,handler)