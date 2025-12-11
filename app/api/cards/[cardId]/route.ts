"use server"
import { NextResponse,NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
export async function GET(req:NextRequest, request: NextRequest, context: any){
    try {
        const {userId, orgId} = await auth();
        const params = context.params
        const {cardId} = params.cardId
        console.log("🤖🤖🤖 CardId::",cardId)
        if(!userId || !orgId) {
            return new NextResponse("Unauthorized",{status:401})
        }

        const card = await prisma.card.findUnique({
            where:{
                id:cardId,
                list:{
                    board:{
                        orgId,
                    },
                },
            },
            include:{
                list:{
                    select:{
                        title:true,
                    },
                },
            },
        });

        return NextResponse.json(card)
    } catch (error) {
        return new NextResponse("Internal Error",{status:500})
    }
}