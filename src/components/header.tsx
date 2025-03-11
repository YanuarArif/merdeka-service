// src/components/header.tsx
"use client";

import { FiSearch, FiUser, FiShoppingCart, FiMapPin } from "react-icons/fi";
import { BiMenuAltLeft } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/useCartStore";
import ShoppingCart from "./shopping-cart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  auth,
  logo,
  menu,
  mobileExtraLinks,
} from "@/constants/header-nav-links";
import { DesktopDropDown } from "./desktop-dropdown";
import { Separator } from "./ui/separator";
import { MobileDropDown } from "./mobile-dropdown";
import { useEffect, useState } from "react";
import { initializeCart } from "@/stores/slices/cartItemsSlice";
import { SideMobileNavItem } from "@/types/navigation";

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const cartItemCount = useCartStore((state) => state.totalItems());
  const [isSticky, setIsSticky] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false); // Added for cart robustness
  const [cartError, setCartError] = useState<string | null>(null); // Added for cart robustness

  // Initialize cart when component mounts and user is logged in
  useEffect(() => {
    if (mounted && session?.user) {
      setIsCartLoading(true);
      try {
        initializeCart(useCartStore.setState);
      } catch (error) {
        setCartError("Failed to load cart items. Please try again.");
        console.error("Cart initialization error:", error);
      } finally {
        setIsCartLoading(false);
      }
    }
  }, [mounted, session]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirectTo: "/" });
  };

  return (
    <nav
      className={`sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md dark:shadow-lg ${
        isSticky ? "sticky top-0" : ""
      }`}
    >
      {/* Main Header & SideMobile Navigation */}
      <div className="px-4 py-1">
        <div className="flex items-center justify-between gap-4 container">
          {/* Logo */}
          <div className="flex flex-[1] items-center gap-2">
            {/* Mobile SideMenu Button */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-transparent"
                    >
                      <BiMenuAltLeft className="!w-8 !h-8" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>
                        <a href={logo.url} className="flex items-center gap-2">
                          <Image
                            src={logo.src}
                            width={32}
                            height={32}
                            className="w-8"
                            alt={logo.alt}
                          />
                          <span className="text-lg font-semibold">
                            {logo.title}
                          </span>
                        </a>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="my-6 flex flex-col gap-6">
                      <Accordion
                        type="single"
                        collapsible
                        className="flex w-full flex-col gap-4"
                      >
                        {menu?.map((item) => renderSideMobileMenuItem(item))}
                      </Accordion>
                      <div className="border-t py-4">
                        <div className="grid grid-cols-2 justify-start">
                          {mobileExtraLinks.map((link, idx) => (
                            <a
                              key={idx}
                              className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                              href={link.url}
                            >
                              {link.name}
                            </a>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Button asChild variant="outline">
                          <a href={auth.login.url}>{auth.login.text}</a>
                        </Button>
                        <Button asChild>
                          <a href={auth.signup.url}>{auth.signup.text}</a>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            <div
              className="cursor-pointer mx-1 my-1"
              onClick={() => router.push("/")}
            >
              <Image
                src="/images/merdeka-logo-cut.png"
                alt="Logo"
                width={200}
                height={100}
                className="w-32 h-auto"
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
            {/* Cart + Auth */}
            <div className="flex flex-none items-center sm:gap-2">
              {/* Cart Icon with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:text-gray-600 dark:hover:text-gray-400 dark:text-gray-300 text-sm mx-2 relative">
                    <FiShoppingCart className="text-xl" />
                    <span className="hidden md:inline">Keranjang</span>
                    {mounted && cartItemCount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[90vw] sm:w-[400px] md:w-[450px] lg:w-[500px] max-h-[70vh] p-2 bg-white shadow-xl rounded-xl border border-gray-200 overflow-auto"
                  align="end"
                >
                  {isCartLoading ? (
                    <div className="p-4 text-center text-gray-600">
                      Loading cart...
                    </div>
                  ) : cartError ? (
                    <div className="p-4 text-center text-red-500">
                      {cartError}
                      <Button
                        variant="link"
                        onClick={() => window.location.reload()}
                        className="mt-2 text-blue-500"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : (
                    <ShoppingCart />
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <span className="dark:text-gray-500">|</span>

              {status === "loading" ? (
                <span>Loading...</span>
              ) : session?.user ? (
                // Direct navigation to dashboard instead of dropdown
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center hover:text-gray-600 dark:hover:text-gray-400 dark:text-gray-300 mx-2 transition-colors duration-200"
                >
                  <Image
                    src={session.user.image || "/images/default-avatar.png"}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full mr-2 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                  />
                  <span className="hidden md:inline text-sm font-medium">
                    {session.user.email?.split("@")[0] || "User"}
                  </span>
                </button>
              ) : (
                // Jika user belum masuk
                <button
                  onClick={() => {
                    router.push("/login");
                  }}
                  className="flex items-center gap-2 hover:text-gray-600 dark:hover:text-gray-400 dark:text-gray-300 text-sm transition-colors duration-200"
                >
                  <FiUser className="text-xl" />
                  <span className="hidden md:inline">Masuk/Daftar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Separator />
      {/* Desktop DropDown Navigation */}
      <div className="hidden md:block">
        <DesktopDropDown />
      </div>
      {/* Mobile DropDown Navigation */}
      <div className="md:hidden">
        <MobileDropDown />
      </div>
    </nav>
  );
};

const renderSideMobileMenuItem = (item: SideMobileNavItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <a
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
              href={subItem.url}
            >
              {subItem.icon}
              <div>
                <div className="text-sm font-semibold">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="font-semibold">
      {item.title}
    </a>
  );
};

export default Header;
