import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
let edgePool: Pool;
let edgeDb: any;

const connectionString = process.env.DATABASE_URL!;

if (process.env.NODE_ENV === "production") {
  // Dalam production, buat instance baru
  const pool = new Pool({ connectionString });
  edgePool = pool;
  edgeDb = neon(connectionString);

  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
} else {
  // Dalam development, gunakan cached client
  if (!global.cachedPrisma) {
    const pool = new Pool({ connectionString });
    edgePool = pool;
    edgeDb = neon(connectionString);

    global.cachedPrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: ["query", "error", "warn"],
    });
  }
  prisma = global.cachedPrisma;
}

// Export semua koneksi yang diperlukan
export const dbEdge = prisma;
export { edgePool, edgeDb };
