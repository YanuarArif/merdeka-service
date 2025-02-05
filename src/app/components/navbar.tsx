"use client";

import {
  Search,
  MapPin,
  Package,
  Gift,
  Menu,
  ChevronDown,
  ShoppingCart,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  return (
    <header className="w-full border-b">
      {/* Top banner */}
      <div className="hidden h-10 w-full items-center justify-between bg-gray-50 px-4 text-sm md:flex">
        <div>Welcome to worldwide Megamart!</div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Deliver to</span>
            <span className="font-medium">423651</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <Link href="#" className="text-blue-500 hover:underline">
              Track your order
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            <Link href="#" className="text-blue-500 hover:underline">
              All Offers
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/merdeka-logo-cut.png"
              alt="MegaMart"
              width={140}
              height={32}
              className="h-14 w-auto"
            />
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center px-8 md:flex">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search essentials, groceries and more..."
              className="w-full pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden gap-2 md:flex">
            <User className="h-5 w-5" />
            Sign Up/Sign In
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden border-t md:block">
        <ul className="flex items-center gap-8 px-4">
          {[
            "Groceries",
            "Premium Fruits",
            "Home & Kitchen",
            "Fashion",
            "Electronics",
            "Beauty",
            "Home Improvement",
            "Sports, Toys & Luggage",
          ].map((category) => (
            <li key={category}>
              <Button
                variant="ghost"
                className="h-12 gap-1 font-normal hover:bg-transparent hover:text-blue-500"
                asChild
              >
                <Link href="#">
                  {category}
                  <ChevronDown className="h-4 w-4" />
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
