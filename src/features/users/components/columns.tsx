import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Role, User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const roleColorMap: Record<Role, string> = {
  [Role.ADMIN]: "bg-purple-500",
  [Role.USER]: "bg-blue-500",
};

export const columns: ColumnDef<User>[] = [
  {
    id: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback>{user.name?.[0] || user.email[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name || "No name"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    id: "username",
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      const username = row.getValue("username") as string;
      return <div className="font-medium">{username || "N/A"}</div>;
    },
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as Role;
      return (
        <Badge className={`${roleColorMap[role]} text-white`}>
          {role.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    id: "emailVerified",
    accessorKey: "emailVerified",
    header: "Status",
    cell: ({ row }) => {
      const emailVerified = row.getValue("emailVerified") as Date | null;
      return (
        <Badge
          className={
            emailVerified ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }
        >
          {emailVerified ? "Verified" : "Unverified"}
        </Badge>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span>{format(date, "PP")}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{format(date, "PPpp")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/users/${user.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/users/${user.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
