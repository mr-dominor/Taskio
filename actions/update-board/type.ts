import z from "zod";
import { UpdateBoard } from "./schema";
import { ActionState } from "@/lib/create-safe-state";
import { Board } from "@prisma/client";

export type InputTye = z.infer<typeof UpdateBoard>
export type ReturnType = ActionState<InputTye,Board>