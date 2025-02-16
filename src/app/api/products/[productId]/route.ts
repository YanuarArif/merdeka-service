import { database } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";

interface RouteContext {
  params: {
    productId: string;
  };
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { productId } = params;

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
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
