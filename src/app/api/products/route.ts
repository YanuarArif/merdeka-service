import { database } from "@/lib/database";
import { Product, Review } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");

    const products = await database.product.findMany({
      where: category
        ? {
            category: category,
          }
        : undefined,
      take: limit ? parseInt(limit) : undefined,
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => {
      const reviews = product.reviews as { rating: number }[];
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((acc, review) => acc + review.rating, 0) /
            reviews.length
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
