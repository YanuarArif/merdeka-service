"use client";

import { FiSearch, FiUser, FiShoppingCart, FiMapPin } from "react-icons/fi";
import { BiMenuAltLeft } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LucidePackageSearch } from "lucide-react";
import { TbRosetteDiscount } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { Navbar1 } from "./ui/shadcnblocks-com-navbar1";
import { useCartStore } from "@/stores/useCartStore";
import ShoppingCart from "./shopping-cart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const route = useRouter();
  const { data: session, status } = useSession();
  const cartItemCount = useCartStore((state) => state.getTotalPrice());

  const handleLogout = async () => {
    await signOut({ redirectTo: "/" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md dark:shadow-lg">
      {/* Top Header/announcement */}
      {/* <div className="bg-gray-100 dark:bg-gray-800 py-2 px-4 hidden md:flex justify-between text-sm">
        <div className="flex container justify-between">
          <div className="flex items-center gap-1 dark:text-gray-300">
            <span>Selamat datang di Merdeka Service</span>
          </div>
          <div className="flex items-center gap-4 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <FiMapPin className="text-gray-600 dark:text-gray-400" />
              <span>Bobotsari, Purbalingga</span>
            </div>
            <span className="dark:text-gray-500">|</span>
            <div className="flex justify-center items-center gap-1">
              <LucidePackageSearch
                size={20}
                className="flex-shrink-0 dark:text-gray-400"
              />
              <button className="hover:text-gray-600 dark:hover:text-gray-400">
                Lacak Pesanan
              </button>
            </div>
            <span className="dark:text-gray-500">|</span>
            <div className="flex justify-center items-center gap-1">
              <TbRosetteDiscount
                size={20}
                className="flex-shrink-0 dark:text-gray-400"
              />
              <button className="hover:text-gray-600 dark:hover:text-gray-400">
                Diskon
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Header */}
      <div className="px-4 py-1">
        <div className="flex items-center justify-between gap-4 container">
          {/* Logo */}
          <div className="flex flex-[1] items-center gap-2">
            {/* <Button
              variant="ghost"
              size="icon"
              className="bg-blue-50 dark:bg-gray-800"
            >
              <BiMenuAltLeft className="!w-8 !h-8 cursor-pointer dark:text-gray-300" />
            </Button> */}
            <div
              className="cursor-pointer mx-1 my-1"
              onClick={() => route.push("/")}
            >
              <Image
                src="/images/merdeka-logo-cut.png"
                alt="Logo"
                width={200}
                height={100}
                className="w-40 h-auto"
              />
            </div>
          </div>

          {/* Search Bar, Auth + Cart */}
          <div className="flex flex-[2] items-center gap-4 justify-between">
            {/* Search Bar */}
            <div className="relative flex-auto">
              <div className="flex">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Cari produk idamanmu..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
            </div>
            {/* Auth + Cart */}
            <div className="flex flex-none items-center sm:gap-2">
              {status === "loading" ? (
                <span>Loading...</span>
              ) : session?.user ? (
                // Jika user sudah login, tampilkan dropdown component
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center text-sm hover:text-gray-600 dark:hover:text-gray-400 dark:text-gray-300">
                      <Image
                        src={session.user.image || "/images/default-avatar.png"}
                        alt="User Avatar"
                        width={30}
                        height={30}
                        className="rounded-full mr-2"
                      />
                      <span className="hidden md:inline">
                        {session.user.email}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-45" align="end">
                    <DropdownMenuItem
                      onClick={() => route.push("/dashboard")}
                      className="hover:cursor-pointer"
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        handleLogout();
                      }}
                      className="hover:cursor-pointer"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Jika user belum masuk

                <button
                  onClick={() => {
                    route.push("/login");
                  }}
                  className="flex items-center gap-2 hover:text-gray-600 dark:hover:text-gray-400 dark:text-gray-300 text-sm"
                >
                  <FiUser className="text-xl" />
                  <span className="hidden md:inline">Masuk/Daftar</span>
                </button>
              )}
              <span className="dark:text-gray-500">|</span>
              {/* Cart Icon with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:text-gray-600 dark:hover:text-gray-400 dark:text-gray-300 text-sm ml-2">
                    <FiShoppingCart className="text-xl" />
                    <span className="hidden md:inline">Keranjang</span>
                    {cartItemCount > 0 && (
                      <div className="abolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-destructive text-white text-xs rounded-full px-2 py-0.5">
                        {cartItemCount}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <ShoppingCart />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Header */}
      <Navbar1 />
    </nav>
  );
};

export default Header;
