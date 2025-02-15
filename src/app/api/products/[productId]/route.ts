import { database } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: {
    productId: string;
  };
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { productId } = await params;

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await database.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
