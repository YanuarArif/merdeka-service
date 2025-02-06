"use client";

import { FiSearch, FiUser, FiShoppingCart, FiMapPin } from "react-icons/fi";
import { BiMenuAltLeft } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LucidePackageSearch } from "lucide-react";
import { TbRosetteDiscount } from "react-icons/tb";
import { categories } from "../data/dropdownmenu";
import { useState, useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Navbar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState({
    left: false,
    right: false,
  });

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowArrows({
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth - 1,
      });
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleWheel = (e: WheelEvent) => {
    if (containerRef.current) {
      // prevent vertical scrolling
      e.preventDefault();
      const deltaY = e.deltaY || e.detail || (e as any).wheelDelta;
      containerRef.current.scrollLeft += deltaY * 2;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // Initial check
      checkScroll();

      // Add event listener
      container.addEventListener("scroll", checkScroll);
      container.addEventListener("wheel", handleWheel, { passive: false });

      // Cleanup
      return () => {
        container.removeEventListener("scroll", checkScroll);
        container.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md dark:shadow-lg">
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

      {/* Main Navbar */}
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
            <h1 className="flex-1 text-2xl font-bold text-blue-600 dark:text-blue-400 relative">
              <Image
                src="/images/merdeka-logo-cut.png"
                alt="Logo"
                width={200}
                height={100}
                className="w-40 h-auto"
              />
            </h1>
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
                  placeholder="Search essentials, groceries and more..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
            </div>
            {/* Auth + Cart */}
            <div className="flex flex-none items-center sm:gap-4">
              <Button
                variant={"ghost"}
                className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-400 dark:text-gray-300"
              >
                <FiUser className="text-xl" />
                <span className="hidden md:inline">Sign Up/Sign In</span>
              </Button>
              <span className="dark:text-gray-500">|</span>
              <Button
                variant={"ghost"}
                className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-400 dark:text-gray-300"
              >
                <FiShoppingCart className="text-xl" />
                <span className="hidden md:inline">Cart</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="relative container flex justify-around">
        {/* Scroll buttons */}
        <div className="md:hidden absolute inset-y-0 left-0 flex items-center z-10">
          <button
            onClick={() => scroll("left")}
            className={`p-2 bg-white dark:bg-gray-800 shadow-md rounded-full transition-opacity ${
              showArrows.left ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll left"
          >
            <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="md:hidden absolute inset-y-0 right-0 flex items-center z-10">
          <button
            onClick={() => scroll("right")}
            className={`p-2 bg-white dark:bg-gray-800 shadow-md rounded-full transition-opacity ${
              showArrows.right ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll right"
          >
            <FiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation container */}
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 w-full overflow-hidden">
          <div
            ref={containerRef}
            className="flex items-center gap-6 overflow-x-auto text-sm container scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            {categories.map((category) => (
              <button
                key={category}
                className="flex-shrink-0 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-1 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 dark:text-gray-300"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
