"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { InputType, Returntype } from "./type"
import { prisma } from "@/lib/db"
import { createSafeState } from "@/lib/create-safe-state"
import { StripeRedirect } from "./schema"
import { absoluteUrl } from "@/lib/utils"
import { stripe } from "@/lib/stripe"
import { revalidatePath } from "next/cache"

const handler = async (data: InputType): Promise<Returntype> => {
  const { orgId, userId } = await auth()
  const user = await currentUser()

  if (!orgId || !userId || !user) {
    return { error: "Not authorized" }
  }

  // Correct absolute URL
  const settingsUrl = absoluteUrl(`/organization/${orgId}`)
  console.log("RETURN URL:", settingsUrl)

  try {
    const existing = await prisma.orgSubscription.findUnique({
      where: { orgId }
    })

    // ---------------------------------------------
    // CASE 1 — Organization already has a Stripe customer: OPEN BILLING PORTAL
    // ---------------------------------------------
    if (existing?.stripeCustomerId) {
      const session = await stripe.billingPortal.sessions.create({
        return_url: settingsUrl,              // <-- NO session_id placeholder allowed
        customer: existing.stripeCustomerId
      })

      return { data: session.url }
    }

    // ---------------------------------------------
    // CASE 2 — No subscription: CREATE CHECKOUT SESSION
    // ---------------------------------------------
    const session = await stripe.checkout.sessions.create({
      success_url: `${settingsUrl}?session_id={CHECKOUT_SESSION_ID}`, // <-- REQUIRED
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Taskio Pro",
              description: "Unlimited boards for your organization",
            },
            unit_amount: 2000,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      metadata: { orgId },
    })

    if (!session.url) return { error: "URL not built" }

    return { data: session.url }

  } catch (error) {
    console.error("Stripe Redirect Error:", error)
    return { error: "Something went wrong" }
  } finally {
    revalidatePath(`/organization/${orgId}`)
  }
}

export const stripeRedirect = createSafeState(StripeRedirect, handler)
