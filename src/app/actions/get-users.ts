export async function getUsers(page: number = 1, limit: number = 10) {
  try {
    const response = await fetch(`/api/users?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return response.json();
  } catch (error) {
    console.error("[GET_USERS]", error);
    throw error;
  }
}
