"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types/product";
import { CellAction } from "./cell-action";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex text-center justify-center items-center w-[40px]">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[40px] flex justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const imageUrls = row.original.imageUrls ?? []; // Changed to array

      return (
        <div className="w-[250px] flex items-center space-x-2">
          {imageUrls.length > 0 ? (
            <img
              src={imageUrls[0]}
              alt={name}
              className="h-10 w-10 object-cover"
            />
          ) : (
            <div className="h-10 w-10 bg-gray-200 flex items-center justify-center">
              -
            </div>
          )}
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="w-[100px]">
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(row.getValue("price") as number)}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="w-[30px]">{row.getValue("category") || "-"}</div>
    ),
  },
  {
    accessorKey: "subCategory",
    header: "Subcategory",
    cell: ({ row }) => (
      <div className="w-[30px]">{row.getValue("subCategory") || "-"}</div>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => <div className="w-[20px]">{row.getValue("stock")}</div>,
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => (
      <div className="w-[50px]">{row.getValue("sku") || "-"}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="w-[20px]">
        <CellAction data={row.original} />
      </div>
    ),
  },
];
