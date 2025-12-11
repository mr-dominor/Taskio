"use server"
import { DeleteBoard } from "./schema";
import {InputType,ReturnType} from "./type"
import { createSafeState } from "@/lib/create-safe-state";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { decrementAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async(data:InputType):Promise<ReturnType> => {
    const {userId, orgId} =await auth();
    if(!userId || !orgId) {
        return{
            error:"Unauthorized action"
        }
    }

    const {id} = data;
    const isPro = await checkSubscription();
    let board;
    try {
        board = await prisma.board.delete({
            where:{id,orgId}
        });
        if(!isPro){
        await decrementAvailableCount()
        }
        await createAuditLog({
        entityTitle: board.title,
        entityId:board.id,
        entityType:ENTITY_TYPE.BOARD,
        action:ACTION.DELETE
        })
    } catch (error) {
        return{error:"Failed to delete"}
    }

    revalidatePath(`/organization/${orgId}`)
    redirect(`/organization/${orgId}`)
}

export const deleteBoard = createSafeState(DeleteBoard,handler)