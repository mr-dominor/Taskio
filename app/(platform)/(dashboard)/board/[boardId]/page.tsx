import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ListContainer } from "./_components/list-container";

interface Context {
  params: Promise<{ boardId: string }>;
}

const BoardIdPage = async ({ params }: Context) => {
  const { boardId } = await params;

  const { orgId } = await auth();
  if (!orgId) {
    redirect("/select-org");
  }

  const lists = await prisma.list.findMany({
    where: {
      boardId,
      board: {
        orgId,
      },
    },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer boardId={boardId} data={lists} />
    </div>
  );
};

export default BoardIdPage;
