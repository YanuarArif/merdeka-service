"use client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CellAction } from "./cell-action";
import { Product } from "@/constants/data";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "imageUrl",
    header: "IMAGE",
    cell: ({ row }) => {
      return (
        <div className="relative aspect-square">
          <Image
            src={row.getValue("imageUrl") || "/images/default-avatar.png"}
            alt={row.getValue("name")}
            fill
            className="rounded-lg"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
  },
  {
    accessorKey: "price",
    header: "PRICE",
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
