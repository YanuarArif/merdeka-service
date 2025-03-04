import { database } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const name = searchParams.get("name"); // Added name filter
    const limit = searchParams.get("limit");

    const products = await database.product.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(name
          ? {
              name: {
                equals: decodeURIComponent(name).trim().replace(/\s+/g, " "),
                mode: "insensitive",
              },
            }
          : {}), // Normalize name for exact matching
      },
      take: limit ? parseInt(limit) : undefined,
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

    if (name && products.length === 0) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // If searching by name, return full product detail format
    if (name) {
      const product = products[0];
      if (!product) {
        return new NextResponse("Product not found", { status: 404 });
      }

      const averageRating =
        product.reviews.length > 0
          ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            product.reviews.length
          : 0;

      return NextResponse.json({
        ...product,
        averageRating,
      });
    }

    // For listing, return simplified format with rating
    const productsWithRating = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            product.reviews.length
          : 0;

      const { reviews: _, ...productWithoutReviews } = product;
      return {
        ...productWithoutReviews,
        rating: avgRating,
      };
    });

    return NextResponse.json(productsWithRating);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}
