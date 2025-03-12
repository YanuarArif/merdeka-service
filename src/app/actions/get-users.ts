"use server";

import { database } from "@/lib/database";

export async function getUsers(page: number = 1, limit: number = 10) {
  try {
    const offset = (page - 1) * limit;

    const [users, total] = await Promise.all([
      database.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          emailVerified: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          image: true,
          password: true,
          provider: true,
        },
      }),
      database.user.count(),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("[GET_USERS]", error);
    throw error;
  }
}
