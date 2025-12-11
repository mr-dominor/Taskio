import z from "zod";
import { StripeRedirect } from "./schema";
import { ActionState } from "@/lib/create-safe-state";
export type InputType = z.infer<typeof StripeRedirect>
export type Returntype = ActionState<InputType, string>