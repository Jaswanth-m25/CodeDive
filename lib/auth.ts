import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import {polarClient} from "@/module/payment/config/polar";
import {polar,checkout,portal,usage,webhooks} from "@polar-sh/better-auth";
import { updateUserTier } from "@/module/payment/lib/subscription";
import { updatePolarCustomerId } from "@/module/payment/lib/subscription";
import {SubscriptionTier, SubscriptionStatus} from "@/module/payment/lib/subscription";
console.log(
  "Polar webhook secret loaded:",
  process.env.POLAR_WEBHOOK_SECRET
    ? `YES (${process.env.POLAR_WEBHOOK_SECRET.slice(0, 10)}...)`
    : "NO"
);
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            scope:["repo"]
        }
    },
    trustedOrigins:["http://localhost:3000","https://augmented-subway-kissable.ngrok-free.dev"],
    plugins:[
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "75f04678-1930-4f10-84ce-cbafdbd24ec3",
                            slug: "codepro" // Custom slug for easy reference in Checkout URL, e.g. /checkout/codepro
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL || "/dashboard/subscription?success=true",
                    authenticatedUsersOnly: true
                }),
                portal({
                    returnUrl: process.env.NEXT_PUBLIC_APP_URL|| "http://localhost:3000/dashboard",
                }),
                usage(),

            ],
        })
    ]
}); 