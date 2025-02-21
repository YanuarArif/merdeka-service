"use client";

import { FiSearch, FiUser, FiShoppingCart, FiMapPin } from "react-icons/fi";
import { BiMenuAltLeft } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LucidePackageSearch, Menu } from "lucide-react";
import { TbRosetteDiscount } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/useCartStore";
import ShoppingCart from "./shopping-cart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  DropDownProps,
  logo,
  menu,
  MenuItem,
  mobileExtraLinks,
} from "@/constants/menu-links";
import { MegaDropDownMenu } from "./megadrop-menu";
import { Separator } from "./ui/separator";
import { MegaDropDownMenuMobile } from "./megadropmenu-mobile";
import { useEffect, useState } from "react";

const Header = () => {
  const route = useRouter();
  const { data: session, status } = useSession();
  const cartItemCount = useCartStore((state) => state.getTotalPrice());
  const [isSticky, setIsSticky] = useState(false);

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
      className={`sticky top-0 z-[9999] bg-white dark:bg-gray-900 shadow-md dark:shadow-lg ${isSticky ? "sticky top-0" : ""}`}
    >
      {/* Main Header */}
      <div className="px-4 py-1">
        <div className="flex items-center justify-between gap-4 container">
          {/* Logo */}
          <div className="flex flex-[1] items-center gap-2">
            {/* Menu icon mobile */}
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
                          <img src={logo.src} className="w-8" alt={logo.alt} />
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
                        {menu?.map((item) => renderMobileMenuItem(item))}
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
                      <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-destructive text-white text-xs rounded-full px-2 py-0.5">
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
      <Separator />
      {/* Categories Header */}
      <div className="hidden md:block">
        <MegaDropDownMenu />
      </div>
      <div className="md:hidden">
        <MegaDropDownMenuMobile />
      </div>
    </nav>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
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
