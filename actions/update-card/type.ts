import z from "zod";
import { UpdateCard } from "./schema";
import { ActionState } from "@/lib/create-safe-state";
import { Card } from "@prisma/client";

export type InputTye = z.infer<typeof UpdateCard>
export type ReturnType = ActionState<InputTye,Card>