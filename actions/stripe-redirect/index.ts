"use server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { InputType, Returntype } from "./type"
import { prisma } from "@/lib/db"
import { createSafeState } from "@/lib/create-safe-state"
import { StripeRedirect } from "./schema"
import { absoluteUrl } from "@/lib/utils"
import { stripe } from "@/lib/stripe"
import { revalidatePath } from "next/cache"

const handler = async(data:InputType):Promise<Returntype> =>{
    const {orgId, userId} = await auth()
    const user = await currentUser();
    if(!orgId || !userId || !user){
        return{error:"Not authorized"}
    }

    const settingsUrl = absoluteUrl(`/organization/${orgId}`)
    let url = "";
    try {
        const orgSubscription = await prisma.orgSubscription.findUnique({
            where:{
                orgId,
            },
        });

        if(orgSubscription && orgSubscription.stripeCustomerId){
            const stripeSession = await stripe.billingPortal.sessions.create({
                return_url: settingsUrl,
                customer: orgSubscription.stripeCustomerId
            });
            url = stripeSession.url;
        }else{
            const stripeSession = await stripe.checkout.sessions.create({
                success_url:settingsUrl,
                cancel_url: settingsUrl,
                payment_method_types:["card"],
                mode:"subscription",
                billing_address_collection:"auto",
                customer_email:user.emailAddresses[0].emailAddress,
                line_items:[
                    {
                        price_data:{
                            currency:"USD",
                            product_data:{
                                name:"Taskio Pro",
                                description:"Unlimited boards for your organization"
                            },
                            unit_amount:2000,
                            recurring:{
                                interval:"month"
                            },
                        },
                        quantity:1,
                    }
                ],
                metadata:{
                    orgId,
                }
            });
            url = stripeSession.url || "";
        }
    } catch (error) {
        console.log(error); 
        return {error:"Something went wrong"}
    }
    revalidatePath(`/organization/${orgId}`)
    return {data:url}
}

export const stripeRedirect = createSafeState(StripeRedirect,handler)