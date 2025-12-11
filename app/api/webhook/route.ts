export const runtime = "nodejs";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    console.log("🚀🚀Stripe webhook reached....")
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    // Verify Stripe signature
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        console.error("❌ Invalid Stripe signature", error);
        return new NextResponse("Invalid signature", { status: 400 });
    }

    try {
        switch (event.type) {
            // ======================================================
            // 1️⃣ Checkout completed → Create org subscription record
            // ======================================================
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log("✅ session checkout created.....")
                if (!session.metadata?.orgId) {
                    console.error("❌ Missing orgId in metadata");
                    return new NextResponse("Org ID missing", { status: 400 });
                }

                // Retrieve full subscription
                const subscription = await stripe.subscriptions.retrieve(
                    session.subscription as string
                );

                // Save subscription info
                await prisma.orgSubscription.create({
                    data: {
                        orgId: session.metadata.orgId,
                        stripeSubscriptionId: subscription.id,
                        stripeCustomerId: subscription.customer as string, // ✅ correct value
                        stripePriceId: subscription.items.data[0].price.id,
                        stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end *1000), 
                    },
                });
                console.log("✅ session checkout completed.....")
                break;
            }

            // ======================================================
            // 2️⃣ Invoice succeeded → Update subscription price
            // ======================================================
            case "invoice.payment_succeeded": {
                const invoice = event.data.object as Stripe.Invoice & {
                    subscription?: string | null; // ✅ TS-safe patch
                };

                if (!invoice.subscription) {
                    console.log("No subscription on invoice");
                    break;
                }

                const subscription = await stripe.subscriptions.retrieve(
                    invoice.subscription
                );

                await prisma.orgSubscription.update({
                    where: {
                        stripeSubscriptionId: subscription.id,
                    },
                    data: {
                        stripePriceId: subscription.items.data[0].price.id,
                        stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end *1000),
                    },
                });

                break;
            }

            default:
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }

        return new NextResponse(null, { status: 200 });

    } catch (error) {
        console.error("❌ Webhook processing failed:", error);
        return new NextResponse("Webhook error", { status: 500 });
    }
}
