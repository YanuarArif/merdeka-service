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
import { Loader2, X } from "lucide-react";
import { useDebounce } from "use-debounce"; // Assuming you install this package
import CartPopup from "./cart-popup";

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const cartItemCount = useCartStore((state) => state.totalItems());
  const [isSticky, setIsSticky] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300); // Debounce search input

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
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirectTo: "/" });
  };

  const handleSearch = () => {
    if (debouncedSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(debouncedSearchQuery)}`);
    }
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
            <div className="lg:hidden">
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
          <div className="flex flex-[2] items-center gap-2 sm:gap-4 justify-between">
            {/* Search Bar */}
            <div className="relative flex-auto">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Cari produk idamanmu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-transparent dark:bg-gray-800 dark:text-gray-300 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-600"
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Cart + Auth */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Cart Icon with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="relative flex items-center gap-1 sm:gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    title="View Cart"
                  >
                    <FiShoppingCart className="text-xl" />
                    <span className="hidden sm:inline text-sm font-medium dark:text-gray-300"></span>
                    {mounted && cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[70vw] sm:w-[300px] md:w-[400px] lg:w-[400px] max-h-[70vh] dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-auto"
                  align="center"
                >
                  {isCartLoading ? (
                    <div className="p-4 flex items-center justify-center text-gray-600 dark:text-gray-300">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Loading cart...
                    </div>
                  ) : cartError ? (
                    <div className="p-4 text-center text-red-500 dark:text-red-400">
                      {cartError}
                      <Button
                        variant="link"
                        onClick={() => {
                          setIsCartLoading(true);
                          initializeCart(useCartStore.setState)
                            .then(() => setCartError(null))
                            .catch(() => setCartError("Failed to reload cart."))
                            .finally(() => setIsCartLoading(false));
                        }}
                        className="mt-2 text-blue-500 dark:text-blue-400"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : (
                    <ShoppingCart />
                    // <CartPopup />
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Separator
                orientation="vertical"
                className="h-6 dark:bg-gray-700"
              />

              {/* Auth Section */}
              {status === "loading" ? (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : session?.user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
                    title={`Welcome, ${session.user.email?.split("@")[0] || "User"}`}
                  >
                    <Image
                      src={session.user.image || "/images/default-avatar.png"}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200"
                    />
                    <span className="hidden lg:inline text-sm font-medium dark:text-gray-300">
                      {session.user.email?.split("@")[0] || "User"}
                    </span>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    title="Logout"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span className="sr-only">Logout</span>
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-1 sm:gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  title="Login or Sign Up"
                >
                  <FiUser className="text-xl" />
                  <span className="hidden sm:inline text-sm font-medium dark:text-gray-300">
                    Masuk/Daftar
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <div className="hidden md:block">
        <DesktopDropDown />
      </div>
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
