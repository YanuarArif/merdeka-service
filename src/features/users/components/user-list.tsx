"use client";

import { columns } from "./columns";
import { User } from "@prisma/client";
import { UserListTable } from "./user-list-table";

interface UserListProps {
  users: User[];
  totalUsers: number;
}

export function UserList({ users, totalUsers }: UserListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Here's a list of all users in your database.
          </p>
        </div>
      </div>

      <UserListTable
        columns={columns}
        data={users}
        totalItems={totalUsers}
        pageSizeOptions={[10, 20, 30, 40, 50]}
      />
    </div>
  );
}
