import { Decimal } from "@prisma/client/runtime/library";

/**
 * Serializes Prisma objects by converting Decimal types to numbers
 * This is needed because Decimal objects cannot be passed to client components
 */
export function serializePrismaObject<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Decimal) {
    return Number(obj) as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(serializePrismaObject) as any;
  }

  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        serializePrismaObject(value),
      ])
    ) as T;
  }

  return obj;
}
