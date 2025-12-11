import z from "zod";
import { UpdateListOrder } from "./schema";
import { ActionState } from "@/lib/create-safe-state";
import { List } from "@prisma/client";

export type InputType = z.infer<typeof UpdateListOrder>
export type ReturnType = ActionState<InputType,List[]>