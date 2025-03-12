import { getUsers } from "@/app/actions/get-users";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { UserList } from "@/features/users/components/user-list";

interface PageSearchParams {
  page?: string;
  limit?: string;
}

interface Props {
  searchParams: PageSearchParams;
}

export default async function UsersPage({ searchParams }: Props) {
  const session = await auth();

  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const { users, total } = await getUsers(
    Number(searchParams.page) || 1,
    Number(searchParams.limit) || 10
  );

  return (
    <div className="flex-1 space-y-4 px-4 py-6 md:px-8">
      <UserList users={users} totalUsers={total} />
    </div>
  );
}
