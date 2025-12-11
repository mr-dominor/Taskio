import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ENTITY_TYPE } from "@prisma/client";

interface Context {
  params: Promise<{ cardId: string }>;
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

    // Await the params promise
    const { cardId } = await context.params;

    if (!cardId) {
      return new NextResponse("Missing cardId", { status: 400 });
    }

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        orgId,
        entityId: cardId,
        entityType: ENTITY_TYPE.CARD,
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    return NextResponse.json(auditLogs);
  } catch (error) {
    console.error("GET /api/cards/[cardId]/logs error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
