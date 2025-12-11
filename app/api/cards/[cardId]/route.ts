import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

interface Context {
  params: Promise<{ cardId: string }>; // params is a Promise
}

export async function GET(
  request: NextRequest,
  context: Context
): Promise<NextResponse> {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // await context.params because it's a Promise
    const { cardId } = await context.params;

    if (!cardId) {
      return new NextResponse("Missing cardId", { status: 400 });
    }

    console.log("🤖🤖🤖 CardId::", cardId);

    const card = await prisma.card.findUnique({
      where: {
        id: cardId,
        list: {
          board: {
            orgId,
          },
        },
      },
      include: {
        list: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error("GET /api/cards/[cardId] error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
