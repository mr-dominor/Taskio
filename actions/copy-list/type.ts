import z from "zod";
import { CopyList } from "./schema";
import { List } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-state";
export type InputType = z.infer<typeof CopyList>
export type Returntype = ActionState<InputType, List>