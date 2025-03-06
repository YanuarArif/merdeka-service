import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/database";
import { auth } from "@/lib/auth";

// GET /api/cart - Get user's cart
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cart = await database.cart.findFirst({
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

    if (!cart) {
      // Create new cart if none exists
      const newCart = await database.cart.create({
        data: {
          userId: session.user.id as string,
        },
        include: {
          items: true,
        },
      });
      return NextResponse.json(newCart);
    }

    return NextResponse.json(cart);
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
    let cart = await database.cart.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!cart) {
      cart = await database.cart.create({
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
        cartId: cart.id,
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
      return NextResponse.json(updatedItem);
    }

    // Create new cart item
    const cartItem = await database.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        price: product.price,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("[CART_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
