import z from "zod";
import { DeleteList } from "./schema";
import { List } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-state";
export type InputType = z.infer<typeof DeleteList>
export type Returntype = ActionState<InputType, List>