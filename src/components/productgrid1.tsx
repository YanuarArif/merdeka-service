"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ShoppingCart, Star } from "lucide-react";
import { Product } from "@prisma/client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [flyingImage, setFlyingImage] = useState<{
    src: string;
    productId: string;
    startPos: { x: number; y: number };
    endPos: { x: number; y: number };
  } | null>(null);

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

  const handleAddToCart = async (
    product: ProductWithRating,
    buttonElement: HTMLButtonElement
  ) => {
    try {
      const price =
        typeof product.price === "number"
          ? product.price
          : parseFloat(product.price.toString());

      // Get the position of the cart icon in the header
      const cartIcon = document.querySelector(".cart-icon") as HTMLElement;
      if (!cartIcon) {
        throw new Error("Cart icon not found");
      }

      // Get the position of the product image
      const productImage = buttonElement
        .closest(".card-content")
        ?.querySelector("img");
      if (!productImage) {
        throw new Error("Product image not found");
      }
      const imageRect = productImage.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      // Set the flying image with positions
      setFlyingImage({
        src: product.imageUrls[0] || "/images/laptops/lenovo-laptop.jpg",
        productId: product.id,
        startPos: {
          x: imageRect.left,
          y: imageRect.top,
        },
        endPos: {
          x: cartRect.left,
          y: cartRect.top,
        },
      });

      // Add item to cart after animation
      await new Promise((resolve) => setTimeout(resolve, 800));
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
    <section className="w-full py-6 relative">
      <AnimatePresence>
        {flyingImage && (
          <motion.div
            initial={{
              scale: 0.8,
              x: flyingImage.startPos.x,
              y: flyingImage.startPos.y,
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              scale: [0.8, 1.2, 0.3],
              x: [
                flyingImage.startPos.x,
                (flyingImage.startPos.x + flyingImage.endPos.x) / 2 - 50,
                flyingImage.endPos.x,
              ],
              y: [
                flyingImage.startPos.y,
                Math.min(flyingImage.startPos.y, flyingImage.endPos.y) - 100,
                flyingImage.endPos.y,
              ],
              opacity: [0, 1, 0],
              rotate: [0, -10, 10],
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              times: [0, 0.5, 1],
            }}
            onAnimationComplete={() => setFlyingImage(null)}
            className="fixed z-50 pointer-events-none"
            style={{
              width: "80px",
              height: "80px",
              position: "fixed",
              top: 0,
              left: 0,
            }}
          >
            <Image
              src={flyingImage.src}
              alt="Flying product"
              width={100}
              height={100}
              className="w-full h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
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
              >
                <CardContent className="p-2 flex flex-col justify-between h-full card-content">
                  <Link
                    href={`/${(product.category || "product").toLowerCase()}/${encodeURIComponent(product.name.trim().replace(/\s+/g, " "))}`}
                    className="cursor-pointer"
                  >
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
                    </div>
                  </Link>
                  <div className="space-y-2">
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
                        onClick={(e) =>
                          handleAddToCart(product, e.currentTarget)
                        }
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
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
