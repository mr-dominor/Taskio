import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Boardnavbar } from "./_components/board-navbar";

export async function generateMetadat ({params}:{params:{boardId:string;}}){
    const {orgId} = await auth();
    const {boardId} = await params;
    if(!orgId || !boardId) {
        return {title:"Board"}
    }

    const board = await prisma.board.findUnique({where:{id:boardId, orgId}}) 

    return {title:board?.title || "Board"
}
}
const BoardIdLayout =async ({
    children,
    params,
}:{children:React.ReactNode;
    params:{boardId:string};
}) => {
    const {orgId} = await auth();
    const {boardId} = await params;
    if(!boardId) return null;
    if(!orgId) {
        redirect("/select-org");
    }

    const board = await prisma.board.findUnique({
        where:{id:boardId}
    })
    console.log(board)
    if(!board) {
        notFound()
    }
    return(

        <div
  className="relative min-h-screen bg-no-repeat bg-center bg-cover"
  style={{ backgroundImage: `url(${board.imageFullUrl})` }}
>
    <Boardnavbar data={board} />
    <div className="absolute inset-0 bg-black/10" />
            <main className="relative pt-28 h-full">
                {children}
            </main>
        </div>
    )
}

export default BoardIdLayout;