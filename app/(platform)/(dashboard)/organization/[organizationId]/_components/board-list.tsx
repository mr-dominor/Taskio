import { HelpCircle, User2 } from "lucide-react"
import { Hint } from "@/components/hint"
import { FormPopover } from "@/components/forms/form-popover"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { MAX_FREE_BOARDS } from "@/constants/boards"
import { getAvailableCount } from "@/lib/org-limit"
import Link from "next/link"
import { checkSubscription } from "@/lib/subscription"
export const BoardList = async() =>{
    const {orgId} = await auth();

    if(!orgId) {
        return redirect("/select-org")
    }
    const boards = await prisma.board.findMany({
        where:{
            orgId
        },
        orderBy:{
            createdAt:"desc"
        }
    });
    const availableCount = await getAvailableCount();
    const isPro = await checkSubscription()
    return(
        <div className="space-y-4">
            <div className="flex items-center font-semibold text-lg text-neutral-700">
                <User2 className="h-6 w-6 mr-2" />
                Your Boards
            </div>
            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {boards.map((board)=>(
                    <Link
                    key={board.id}
                    href={`/board/${board.id}`}
                    className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
                    style={{backgroundImage:`url(${board.imageThumbUrl})`}}
                    >
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
                        <p className="relative font-semibold text-white">
                            {board.title}
                        </p>
                    </Link>
                ))}
                <FormPopover side="right" sideOffset={10}>
                    <div role="button" className="aspect-video relative w-full h-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition">
                    <p className="text-xs">Create New Board</p>
                    <span className="text-xs">{isPro?"Unlimited":`${MAX_FREE_BOARDS-availableCount} remaining!`}</span>
                    <Hint
                    sideOffset={40}
                    description={"Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace."}
                    >
                        <HelpCircle className="absolute bottom-2 right-5" />
                    </Hint>
                </div>
                </FormPopover>
            </div>
        </div>
    )
}