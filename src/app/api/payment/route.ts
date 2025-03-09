import { createTransaction } from "@/lib/midtrans";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { getClientIp } from "@/lib/utils";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { database } from "@/lib/database";

const paymentSchema = z.object({
  orderId: z.string().min(1),
  amount: z.number().positive(),
  customerDetails: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
    })
    .optional(),
});

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const ip = getClientIp(request) ?? "127.0.0.1";
    await limiter.check(5, ip); // 5 requests per minute per IP

    // Idempotency check
    const idempotencyKey = request.headers.get("Idempotency-Key");
    if (!idempotencyKey) {
      return NextResponse.json(
        { error: "Idempotency-Key header is required" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = paymentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { orderId } = validationResult.data;

    // Get order details and verify ownership
    const order = await database.order.findUnique({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found or unauthorized" },
        { status: 404 }
      );
    }

    // Use the raw amount for IDR (no cents conversion needed)
    const amount = Math.round(order.totalAmount.toNumber());

    // Prepare customer info from order
    const customerDetails = {
      firstName: order.user.name?.split(" ")[0] || "",
      lastName: order.user.name?.split(" ").slice(1).join(" ") || "",
      email: order.user.email,
    };

    // Create transaction with retry logic
    let retries = 3;
    let transaction;

    while (retries > 0) {
      try {
        transaction = await createTransaction({
          orderId,
          amount, // Amount in Rupiah
          customerDetails,
        });
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retry
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: transaction,
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "Idempotency-Key": idempotencyKey || "",
        },
      }
    );
  } catch (error) {
    console.error("Payment error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    if ((error as Error).message === "Rate limit exceeded") {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "Payment creation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
