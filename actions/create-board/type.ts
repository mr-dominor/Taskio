
import {z} from "zod";
import { CreateBoard } from "./schema";
import { ActionState } from "@/lib/create-safe-state";
import { Board } from "@prisma/client";

export type InputType = z.infer<typeof CreateBoard>
//extracting datatype of passed as input

export type ReturnType = ActionState<InputType, Board>