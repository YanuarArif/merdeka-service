import { PrismaClient } from "@prisma/client";

export async function generateOrderNumber(database: PrismaClient) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}${day}`;

  // Get latest order for this month
  const latestOrder = await database.order.findFirst({
    where: {
      orderNumber: {
        startsWith: `INV-${year}-${month}`,
      },
    },
    orderBy: {
      orderNumber: "desc",
    },
  });

  // Get next number (resets monthly)
  const nextNumber = latestOrder
    ? parseInt(latestOrder.orderNumber.split("-")[3]) + 1
    : 1;

  // Format: INV-2025-0310-0001
  return `INV-${dateStr}-${nextNumber.toString().padStart(4, "0")}`;
}
