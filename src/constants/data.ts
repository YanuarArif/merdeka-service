import { SideItem } from "@/types";

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const sidebarItems: SideItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard/overview",
    icon: "dashboard",
    isActive: false,
    shortcut: ["d", "d"],
    items: [], // Empty array as there are no child items for Dashboard
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: "product",
    shortcut: ["p", "p"],
    isActive: false,
    items: [
      {
        title: "Daftar Produk",
        shortcut: ["l", "l"],
        url: "/dashboard/products/",
      },
      {
        title: "Tambah Produk",
        shortcut: ["t", "t"],
        url: "/dashboard/products/new",
      },
    ], // No child items
  },
  {
    title: "Settings",
    url: "#", // Placeholder as there is no direct link for the parent
    icon: "settings",
    isActive: false,

    items: [
      {
        title: "Account",
        shortcut: ["l", "l"],
        url: "/dashboard/account",
        icon: "login",
      },
      {
        title: "Profile",
        url: "/dashboard/profile",
        icon: "userPen",
        shortcut: ["m", "m"],
      },
    ],
  },
  {
    title: "Shopping Cart",
    url: "/dashboard/cart",
    icon: "cart",
    shortcut: ["s", "c"],
    isActive: false,
    items: [],
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: "orders",
    shortcut: ["k", "k"],
    isActive: false,
    items: [],
  },
  {
    title: "Home",
    url: "/",
    icon: "home",
    shortcut: ["k", "k"],
    isActive: false,
    items: [], // No child items
  },
];
