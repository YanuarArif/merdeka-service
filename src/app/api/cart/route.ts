import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/database";
import { auth } from "@/lib/auth";
import { serializePrismaObject } from "@/lib/prisma-serializer";

// GET /api/cart - Get user's cart
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cartData = await database.cart.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cartData) {
      // Create new cart if none exists
      const newCartData = await database.cart.create({
        data: {
          userId: session.user.id as string,
        },
        include: {
          items: true,
        },
      });
      return NextResponse.json(serializePrismaObject(newCartData));
    }

    return NextResponse.json(serializePrismaObject(cartData));
  } catch (error) {
    console.error("[CART_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST /api/cart - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { productId, quantity } = body;

    if (!productId || !quantity) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get or create cart
    let cartData = await database.cart.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!cartData) {
      cartData = await database.cart.create({
        data: {
          userId: session.user.id as string,
        },
      });
    }

    // Get product for price
    const product = await database.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Check if item already exists in cart
    const existingItem = await database.cartItem.findFirst({
      where: {
        cartId: cartData.id,
        productId,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      const updatedItem = await database.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: true,
        },
      });
      return NextResponse.json(serializePrismaObject(updatedItem));
    }

    // Create new cart item
    const cartItem = await database.cartItem.create({
      data: {
        cartId: cartData.id,
        productId,
        quantity,
        price: product.price,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(serializePrismaObject(cartItem));
  } catch (error) {
    console.error("[CART_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
