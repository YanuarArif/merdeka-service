"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ErrorMessage } from "@/components/ui/errormessage";
import Link from "next/link";
import { ChevronRight, Star, Truck, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProductDetailProps {
  maincategory: string;
  nameproduct: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrls: string[];
  category: string | null;
  subCategory: string | null;
  stock: number;
  averageRating: number;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
      name: string | null;
      image: string | null;
    };
  }>;
}

export default function ProductDetail({
  maincategory,
  nameproduct,
}: ProductDetailProps) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartError, setCartError] = useState<string | undefined>(undefined);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [flyingImage, setFlyingImage] = useState<{
    src: string;
    startPos: { x: number; y: number };
    endPos: { x: number; y: number };
  } | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const addItemToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `/api/products?category=${encodeURIComponent(maincategory)}&name=${encodeURIComponent(nameproduct)}`
        );
        if (!response.ok)
          throw new Error("Failed to fetch product (this product detail)");
        const productData = await response.json();
        if (!productData || typeof productData === "string")
          throw new Error("Product not found");
        setProduct(productData);
        setMainImage(
          productData.imageUrls[0] || "/images/laptops/lenovo-laptop.jpg"
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [maincategory, nameproduct]);

  const handleAddToCart = useCallback(
    async (buttonElement: HTMLButtonElement) => {
      if (!product) return;
      try {
        // Get the position of the cart icon in the header
        const cartIcon = document.querySelector(".cart-icon") as HTMLElement;
        if (!cartIcon) {
          throw new Error("Cart icon not found");
        }

        // Get the position of the product image
        const productImage = document.querySelector(
          ".main-product-image"
        ) as HTMLElement;
        if (!productImage) {
          throw new Error("Product image not found");
        }

        const imageRect = productImage.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        // Set the flying image
        setFlyingImage({
          src: product.imageUrls[0] || "/images/laptops/lenovo-laptop.jpg",
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
          price: Number(product.price),
          image: product.imageUrls[0] || "/images/laptops/lenovo-laptop.jpg",
          quantity: quantity,
        });

        toast({
          description: `${product.name} added to cart!`,
        });
      } catch (err) {
        if (err instanceof Error) {
          setCartError(err.message);
        } else {
          setCartError("Failed to add item to cart");
        }
      }
    },
    [product, quantity, addItemToCart, toast]
  );

  const handleCartErrorClose = useCallback(() => {
    setCartError(undefined);
  }, []);

  const handleImageClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-4 bg-gray-200 w-1/3 mb-8" />
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gray-200 aspect-square rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 w-3/4" />
            <div className="h-4 bg-gray-200 w-1/4" />
            <div className="h-12 bg-gray-200 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  const thumbnails =
    product.imageUrls.length > 0
      ? product.imageUrls
      : ["/images/laptops/lenovo-laptop.jpg"];

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="container mx-auto py-8">
      <ErrorMessage
        error={cartError}
        onClose={handleCartErrorClose}
        duration={3000}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">
          {capitalizeFirstLetter("home")}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/${maincategory}`} className="hover:text-primary">
          {capitalizeFirstLetter(maincategory || "all products")}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-24 shrink-0">
            {thumbnails.map((thumb, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-full aspect-square border rounded-lg overflow-hidden cursor-pointer hover:border-primary",
                  mainImage === thumb && "border-primary"
                )}
                onMouseEnter={() => setMainImage(thumb)}
              >
                <Image
                  src={thumb}
                  alt={`Product thumbnail ${idx + 1}`}
                  width={96}
                  height={96}
                  className="object-contain w-full h-full p-1"
                />
              </div>
            ))}
          </div>
          <div
            className="flex-1 border rounded-lg overflow-hidden relative cursor-zoom-in aspect-square"
            onClick={handleImageClick}
          >
            <Image
              src={mainImage || "/images/laptops/lenovo-laptop.jpg"}
              alt="Product main image"
              width={600}
              height={600}
              className="object-contain w-full h-full p-4 main-product-image"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6 p-6 bg-background rounded-lg border">
          <div className="space-y-4">
            <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
              <Truck className="w-4 h-4 mr-2" />
              Ready to ship
            </div>

            <h1 className="text-2xl font-bold text-foreground">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 border-b pb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {product.averageRating.toFixed(1)}
                </span>
                <span className="mx-2">·</span>
                <span>{product.reviews.length} reviews</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-foreground">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(product.price)}
              </div>
              <p className="text-sm text-muted-foreground">
                Inclusive of all taxes
              </p>
            </div>

            <div className="bg-orange-50 text-orange-800 p-4 rounded-lg border border-orange-100">
              <div className="flex items-center gap-2 font-medium">
                <Clock className="w-5 h-5" />
                <span>Flash Sale Ends in: 17:22:09:52</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium">Quantity:</label>
                <Select
                  value={quantity.toString()}
                  onValueChange={(value) => setQuantity(parseInt(value))}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} unit{num > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-2">
                <Button
                  size="lg"
                  className="flex-1 text-base font-semibold"
                  onClick={(e) => handleAddToCart(e.currentTarget)}
                >
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="flex-1 text-base font-semibold"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium text-base mb-3">Why buy from us?</h3>
            <div className="grid gap-4">
              <div className="flex items-center gap-3 bg-secondary/50 p-3 rounded-lg">
                <Truck className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    On orders over $30
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-secondary/50 p-3 rounded-lg">
                <Shield className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-sm text-muted-foreground">
                    Protected by Buyer Guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Image Preview */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={handleClosePopup}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={mainImage || "/images/laptops/lenovo-laptop.jpg"}
              alt="Product preview"
              width={800}
              height={800}
              className="object-contain w-full h-full p-4"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-white text-black hover:bg-gray-200"
              onClick={handleClosePopup}
            >
              <span className="text-2xl">×</span>
            </Button>
          </div>
        </div>
      )}

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

      {/* Description Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">Description</h2>
        <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
          {product.description ? (
            <p>{product.description}</p>
          ) : (
            <p className="text-muted-foreground">
              No description available for this product.
            </p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        {product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-primary fill-primary"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No reviews yet</p>
        )}
      </div>
    </div>
  );
}
