import { database } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized - Please login first", {
        status: 401,
      });
    }

    const { productId } = await params;

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    // Get user ID
    const user = await database.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get product details before deletion to get the image URL
    const product = await database.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Check if the product belongs to the user
    if (product.userId !== user.id) {
      return new NextResponse(
        "Unauthorized - This product belongs to another user",
        { status: 403 }
      );
    }

    // If product has an image URL, delete it from blob storage
    if (product.imageUrl) {
      try {
        await del(product.imageUrl, {
          token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,
        });
      } catch (error) {
        console.error("[BLOB_DELETE_ERROR]", error);
        // Continue with product deletion even if blob deletion fails
      }
    }

    // Delete the product from database
    const deletedProduct = await database.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
