"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ShoppingCart, Star } from "lucide-react";
import { Product } from "@prisma/client";
import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ErrorMessage } from "./ui/errormessage";

interface ProductWithRating extends Product {
  rating: number;
}

export default function LaptopGrid() {
  const addItemToCart = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState<ProductWithRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartError, setCartError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?category=laptop");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product: ProductWithRating) => {
    try {
      const price =
        typeof product.price === "number"
          ? product.price
          : parseFloat(product.price.toString());

      await addItemToCart({
        productId: product.id,
        name: product.name,
        price: price,
        image: product.imageUrls[0] || "/images/laptops/lenovo-laptop.jpg",
        quantity: 1,
      });
    } catch (err) {
      setCartError(
        err instanceof Error ? err.message : "Failed to add item to cart"
      );
    }
  };

  return (
    <section className="w-full py-6">
      <ErrorMessage
        error={cartError}
        onClose={() => setCartError(undefined)}
        duration={3000}
      />
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm md:text-lg font-medium md:underline decoration-4 decoration-blue-500 underline-offset-8">
            Tawaran terbaik untuk {""}
            <span className="text-blue-500 ">Laptop Berkualitas</span>
          </h2>
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
          {isLoading ? (
            // Loading skeletons
            Array(5)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-2">
                    <div className="h-40 bg-gray-200 rounded mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))
          ) : error ? (
            <div className="col-span-full text-center text-red-500">
              {error}
            </div>
          ) : (
            products.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg hover:border-blue-400 transition-shadow"
                onClick={(e) => {
                  // Prevent navigation when clicking the add to cart button
                  if ((e.target as HTMLElement).closest("button")) {
                    e.preventDefault();
                  }
                }}
              >
                <Link
                  href={`/${(product.category || "product").toLowerCase()}/${encodeURIComponent(product.name.trim().replace(/\s+/g, " "))}`}
                  className="cursor-pointer"
                >
                  <CardContent className="p-2 flex flex-col justify-between h-full">
                    <div className="relative">
                      <div className="absolute top-0 left-0 z-10 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg"></div>
                      <Image
                        src={
                          product.imageUrls[0] || // Use the first image from imageUrls
                          "/images/laptops/lenovo-laptop.jpg"
                        }
                        alt={product.name}
                        width={200}
                        height={200}
                        className="mx-auto mb-4 h-auto w-auto object-contain"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm">{product.name}</h3>
                      <div className="flex items-baseline gap-2 justify-between">
                        <span className="text-base font-bold">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(
                            typeof product.price === "number"
                              ? product.price
                              : parseFloat(product.price.toString())
                          )}
                        </span>
                        <Button
                          variant="outline"
                          className="p-2 m-1 rounded-lg !w-10 !h-8"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            size={14}
                            className={
                              index < Math.round(product.rating)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        ))}
                        <span className="text-xs text-gray-500">
                          ({product.rating.toFixed(1)})
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
