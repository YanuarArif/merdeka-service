import { NavItem } from "@/types";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string | null;
  createdAt: string; // Changed from Date to string
  updatedAt: string; // Changed from Date to string
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard/overview",
    icon: "dashboard",
    isActive: false,
    shortcut: ["d", "d"],
    items: [], // Empty array as there are no child items for Dashboard
  },
  {
    title: "Product",
    url: "/dashboard/product",
    icon: "product",
    shortcut: ["p", "p"],
    isActive: false,
    items: [], // No child items
  },
  {
    title: "Settings",
    url: "#", // Placeholder as there is no direct link for the parent
    icon: "settings",
    isActive: true,

    items: [
      {
        title: "Account",
        shortcut: ["l", "l"],
        url: "/",
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
    title: "Orders",
    url: "/dashboard/orders",
    icon: "orders",
    shortcut: ["k", "k"],
    isActive: false,
    items: [], // No child items
  },
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
    image: "https://api.slingacademy.com/public/sample-users/1.png",
    initials: "OM",
  },
  {
    id: 2,
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
    image: "https://api.slingacademy.com/public/sample-users/2.png",
    initials: "JL",
  },
  {
    id: 3,
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
    image: "https://api.slingacademy.com/public/sample-users/3.png",
    initials: "IN",
  },
  {
    id: 4,
    name: "William Kim",
    email: "will@email.com",
    amount: "+$99.00",
    image: "https://api.slingacademy.com/public/sample-users/4.png",
    initials: "WK",
  },
  {
    id: 5,
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$39.00",
    image: "https://api.slingacademy.com/public/sample-users/5.png",
    initials: "SD",
  },
];
