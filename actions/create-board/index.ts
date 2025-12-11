"use server"
import { revalidatePath } from "next/cache";
import { InputType ,ReturnType} from "./type";
import { createSafeState } from "@/lib/create-safe-state";
import { CreateBoard } from "./schema";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { incrementAvailableCount, hasAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async(data:InputType):Promise<ReturnType> =>{
    const {title, image} = data
    const {orgId,userId} = await auth()

    const canCreate = await hasAvailableCount();
    const isPro = await checkSubscription()
    if(!canCreate && !isPro){
        return{
            error:"You have reached your limit of free boards. Please upgrade to create more."
        }
    }
    if(!orgId || !userId) {return{error:"Unauthorized error"}}
    const [imageId,imageThumbUrl, imageFullUrl,imageLinkHTML, imageUserName] = image.split("|");
    console.log("--->",imageThumbUrl)
    if(!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName){
        return{
            error:"Missing fields. Failed to create board."
        }
    }

    

    let board
    try {
        board = await prisma?.board.create({
            data:{
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageLinkHTML,
                imageUserName
            }
        });
        if(!isPro){
            await incrementAvailableCount()
        }
        await createAuditLog({
            entityTitle: board.title,
            entityId:board.id,
            entityType:ENTITY_TYPE.BOARD,
            action:ACTION.CREATE
        })
    } catch (error) {
        console.log("title server error",error)
    return {
        error:"Failed to create"
    }
}
    revalidatePath(`/board/${board?.id}`)
    return {data:board}
}

export const createBoard = createSafeState(CreateBoard, handler)