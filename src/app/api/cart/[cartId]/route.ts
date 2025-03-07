import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/database";
import { auth } from "@/lib/auth";
import { serializePrismaObject } from "@/lib/prisma-serializer";

// PUT /api/cart/[cartId] - Update cart item
export async function PUT(
  req: NextRequest,
  { params }: { params: { cartId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || quantity === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Verify cart belongs to user
    const cart = await database.cart.findFirst({
      where: {
        id: params.cartId,
        userId: session.user.id,
      },
    });

    if (!cart) {
      return new NextResponse("Cart not found", { status: 404 });
    }

    // Update cart item
    const updatedItem = await database.cartItem.update({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      data: {
        quantity: quantity,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(serializePrismaObject(updatedItem));
  } catch (error) {
    console.error("[CART_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/cart/[cartId] - Remove item from cart or clear cart
export async function DELETE(
  req: NextRequest,
  { params }: { params: { cartId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify cart belongs to user
    const cart = await database.cart.findFirst({
      where: {
        id: params.cartId,
        userId: session.user.id,
      },
    });

    if (!cart) {
      return new NextResponse("Cart not found", { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get("itemId");

    if (cartItemId) {
      // Delete specific item
      await database.cartItem.delete({
        where: {
          id: cartItemId,
          cartId: cart.id,
        },
      });
    } else {
      // Clear entire cart
      await database.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CART_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
