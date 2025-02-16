import { database } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params; // ❌ Removed 'await' (params is not a Promise)

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
