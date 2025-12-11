import z from "zod";
import { DeleteCard } from "./schema";
import { Card } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-state";
export type InputType = z.infer<typeof DeleteCard>
export type Returntype = ActionState<InputType, Card>