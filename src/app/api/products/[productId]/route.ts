import { database } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> } // Type params as a Promise
) {
  try {
    const { productId } = await params; // Await the params Promise

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await database.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Calculate average rating
    const averageRating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
          product.reviews.length
        : 0;

    return NextResponse.json({
      ...product,
      averageRating,
    });
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

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
    if (product.imageUrls) {
      try {
        await del(product.imageUrls, {
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
