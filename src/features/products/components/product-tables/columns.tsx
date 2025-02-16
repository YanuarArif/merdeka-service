"use client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CellAction } from "./cell-action";
import { Product } from "@/constants/data";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox component

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "imageUrl", // Keep imageUrl for data fetching
    header: "Nama Produk",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          {/* Left Image */}
          <div className="relative w-12 h-12">
            <Image
              src={row.original.imageUrl || "/images/default-avatar.png"}
              alt={row.original.name}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          {/* Selectable Text */}
          <span className="w-[120px] select-all">{row.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Kategori",
  },
  {
    accessorKey: "price",
    header: "Harga",
    cell: ({ row }) => {
      const price = row.getValue("price");

      // Ensure price is a number and format it for Indonesian currency
      const formattedPrice =
        typeof price === "number"
          ? new Intl.NumberFormat("id-ID").format(price)
          : "Invalid Price";

      return <span className="w-[100px]">Rp{formattedPrice}</span>;
    },
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
