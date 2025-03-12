import { getUsers } from "@/app/actions/get-users";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { UserList } from "@/features/users/components/user-list";

// Use any to bypass strict typing
interface Props {
  searchParams: any;
}

export default async function UsersPage({ searchParams }: Props) {
  const session = await auth();

  // Redirect if user is not authenticated or not an admin
  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  // Resolve the searchParams Promise
  const resolvedSearchParams = await (searchParams || Promise.resolve({}));

  // Safely extract page and limit with defaults
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || 10;

  const { users, total } = await getUsers(page, limit);

  return (
    <div className="flex-1 space-y-4 px-4 py-6 md:px-8">
      <UserList users={users} totalUsers={total} />
    </div>
  );
}
