"use server"
import { createSafeState } from "@/lib/create-safe-state";
import { InputTye, ReturnType } from "./type";
import { UpdateBoard } from "./schema";
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

    const {title, id} = data;
    let board;
    try {
        board = await prisma.board.update({
            where:{
                id,
                orgId
            },
            data:{
                title
            }
        })
        await createAuditLog({
            entityTitle: board.title,
            entityId:board.id,
            entityType:ENTITY_TYPE.BOARD,
            action:ACTION.UPDATE
        })
    } catch (error) {
        return{
            error:"Failed to update"
        }
    }
    revalidatePath(`/board/${id}`)
    return {data:board};
}

export const updateBoard = createSafeState(UpdateBoard,handler)