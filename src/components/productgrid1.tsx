"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ShoppingCart, Star } from "lucide-react";
import { Phone, phones } from "../app/(main)/constants/phone";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function LaptopGrid() {
  const addItemToCart = useCartStore((state) => state.addItem);
  // Select only the first 5 phones for desktop view
  const desktopPhones = phones.slice(0, 5);

  const handleAddToCart = (phone: Phone) => {
    addItemToCart({
      productId: phone.id,
      name: phone.name,
      price: phone.price,
      image: phone.image,
      quantity: 1,
    });
    alert(`${phone.name} ditambah ke Keranjang!`);
  };

  return (
    <section className="w-full py-6">
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm md:text-lg font-medium md:underline decoration-4 decoration-blue-500 underline-offset-8">
            Tawaran terbaik untuk {""}
            <span className="text-blue-500 ">Laptop Berkualitas</span>
          </h2>
          {/* <Separator className="w-full bottom-3" /> */}
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-blue-500 flex items-center"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {desktopPhones.map((phone) => (
            <Card
              key={phone.id}
              className="hover:shadow-lg hover:border-blue-400 hover:cursor-pointer transition-shadow"
            >
              <CardContent className="p-2 flex flex-col justify-between h-full">
                <div className="relative">
                  <div className="absolute top-0 left-0 z-10 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg"></div>
                  <Image
                    src={phone.image || "/images/laptops/lenovo-laptop.jpg"}
                    alt={phone.name}
                    width={200}
                    height={500}
                    className="mx-auto mb-4 h-30 w-auto"
                    // style={{ width: "auto", height: "auto" }}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">{phone.name}</h3>
                  <div className="flex items-baseline gap-2 justify-between">
                    <span className="text-base font-bold">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(phone.price)}
                    </span>
                    {/* Tombol tambah ke Keranjang */}
                    <Button
                      variant="outline"
                      className="p-2 m-1 rounded-lg !w-10 !h-8"
                      onClick={() => handleAddToCart(phone)}
                    >
                      <ShoppingCart className="" />
                    </Button>
                  </div>
                  {/* ⭐ Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={14}
                        className={
                          index < Math.round(phone.rating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="text-xs text-gray-500">
                      ({phone.rating})
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
