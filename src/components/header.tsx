"use client";

import { FiSearch, FiUser, FiShoppingCart, FiMapPin } from "react-icons/fi";
import { BiMenuAltLeft } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LucidePackageSearch } from "lucide-react";
import { TbRosetteDiscount } from "react-icons/tb";
import { categories } from "../app/(main)/data/dropdownmenu";
import { useState, useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useRouter } from "next/navigation";

const HeaderUi = () => {
  const route = useRouter();

  return (
    <nav className="sticky top-0 bg-white dark:bg-gray-900 shadow-md dark:shadow-lg">
      {/* Top Header */}
      <div className="bg-gray-100 dark:bg-gray-800 py-2 px-4 hidden md:flex justify-between text-sm">
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
      </div>

      {/* Main HeaderUi */}
      <div className="px-4 py-1">
        <div className="flex items-center justify-between gap-4 container">
          {/* Logo */}
          <div className="flex flex-[1] items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-blue-50 dark:bg-gray-800"
            >
              <BiMenuAltLeft className="!w-8 !h-8 cursor-pointer dark:text-gray-300" />
            </Button>
            <div className="cursor-pointer" onClick={() => route.push("/")}>
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
            <div className="flex flex-none items-center sm:gap-4">
              <Button
                onClick={() => {
                  route.push("/login");
                }}
                variant={"ghost"}
                className="flex items-center gap-2 hover:text-gray-600 dark:hover:text-gray-400 dark:text-gray-300"
              >
                <FiUser className="text-xl" />
                <span className="hidden md:inline">Masuk/Daftar</span>
              </Button>
              <span className="dark:text-gray-500">|</span>
              <Button
                variant={"ghost"}
                className="flex items-center gap-2 hover:text-gray-600 dark:hover:text-gray-400 dark:text-gray-300"
              >
                <FiShoppingCart className="text-xl" />
                <span className="hidden md:inline">Keranjang</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
    </nav>
  );
};

export default HeaderUi;
