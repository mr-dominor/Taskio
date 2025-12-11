import z from "zod";
import { CopyCard } from "./schema";
import { Card } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-state";
export type InputType = z.infer<typeof CopyCard>
export type Returntype = ActionState<InputType, Card>