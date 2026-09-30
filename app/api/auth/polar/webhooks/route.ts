import { NextRequest, NextResponse } from "next/server";
import { webhooks } from "polar-sdk-v1/2026-10";
import prisma from "@/lib/db";

import {
  updateUserTier,
  updatePolarCustomerId,
} from "@/module/payment/lib/subscription";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const headers = {
      "webhook-id": req.headers.get("webhook-id") ?? "",
      "webhook-timestamp":
        req.headers.get("webhook-timestamp") ?? "",
      "webhook-signature":
        req.headers.get("webhook-signature") ?? "",
    };

    const secret = process.env.POLAR_WEBHOOK_SECRET;

    if (!secret) {
      throw new Error("POLAR_WEBHOOK_SECRET is missing");
    }

    const event = await webhooks.validateEvent(
      body,
      headers,
      secret
    );

    console.log("Polar webhook received:", event.type);

    // --------------------------------------------------
    // CUSTOMER CREATED
    // --------------------------------------------------

    if (event.type === "customer.created") {
      const customer = event.data;

      const externalId = customer.external_id;

      if (externalId) {
        await updatePolarCustomerId(
          externalId,
          customer.id
        );

        console.log(
          "Polar customer linked to user:",
          externalId
        );
      }
    }

    // --------------------------------------------------
    // SUBSCRIPTION CREATED / ACTIVE
    // --------------------------------------------------

    if (
      event.type === "subscription.created" ||
      event.type === "subscription.active"
    ) {
      const subscription = event.data;

      const userId = subscription.customer?.external_id;

      if (!userId) {
        console.error(
          "Subscription event: customer external_id is missing"
        );
      } else {
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (!user) {
          console.error(
            "Subscription event: user not found:",
            userId
          );
        } else {
          // Save Polar customer ID
          await updatePolarCustomerId(
            user.id,
            subscription.customer_id
          );

          // Upgrade user
          await updateUserTier(
            user.id,
            "PRO",
            "ACTIVE",
            subscription.id
          );

          console.log(
            `User ${user.id} upgraded to PRO`
          );
        }
      }
    }

    // --------------------------------------------------
    // SUBSCRIPTION CANCELED
    // --------------------------------------------------

    if (event.type === "subscription.canceled") {
      const subscription = event.data;

      const userId = subscription.customer?.external_id;

      if (!userId) {
        console.error(
          "Subscription canceled: customer external_id is missing"
        );
      } else {
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (user) {
          await updateUserTier(
            user.id,
            "PRO",
            "CANCELED",
            subscription.id
          );

          console.log(
            `Subscription canceled for user ${user.id}`
          );
        }
      }
    }

    // --------------------------------------------------
    // SUBSCRIPTION REVOKED
    // --------------------------------------------------

    if (event.type === "subscription.revoked") {
      const subscription = event.data;

      const userId = subscription.customer?.external_id;

      if (!userId) {
        console.error(
          "Subscription revoked: customer external_id is missing"
        );
      } else {
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (user) {
          await updateUserTier(
            user.id,
            "FREE",
            "EXPIRED",
            subscription.id
          );

          console.log(
            `Subscription revoked for user ${user.id}`
          );
        }
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("Polar webhook error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed",
      },
      { status: 400 }
    );
  }
}