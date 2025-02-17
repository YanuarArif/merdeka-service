"use client";

import { useState } from "react";
import Image from "next/image";
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

export default function ProductDetail() {
  const [mainImage, setMainImage] = useState(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sLET6nnOIeCNEnscMpVD395ySl5uSS.png"
  );

  const thumbnails = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sLET6nnOIeCNEnscMpVD395ySl5uSS.png",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/category" className="hover:text-primary">
          Business, Industry & Science
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Sneaker Dryer Bag</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="flex flex-col gap-2">
            {thumbnails.map((thumb, idx) => (
              <div
                key={idx}
                className="w-20 h-20 border rounded-lg overflow-hidden cursor-pointer hover:border-primary"
                onMouseEnter={() => setMainImage(thumb)}
              >
                <Image
                  src={thumb || "/placeholder.svg"}
                  alt={`Product thumbnail ${idx + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 border rounded-lg overflow-hidden">
            <Image
              src={mainImage || "/placeholder.svg"}
              alt="Product main image"
              width={600}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-sm mb-4">
              <Truck className="w-4 h-4 mr-1" />
              Local warehouse
            </div>
            <h1 className="text-2xl font-semibold mb-4">
              Sneaker Dryer Bag, Durable Shoe Washing Bag With Elastic Straps
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                (494 reviews)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">$4.36</span>
              <span className="text-sm text-muted-foreground line-through">
                $8.99
              </span>
            </div>

            <div className="bg-orange-100 text-orange-700 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Big sale ends in 17:22:09:52</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Select defaultValue="1">
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1">Add to cart</Button>
              <Button className="flex-1" variant="secondary">
                Buy now
              </Button>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              <span>Free shipping on orders over $30</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Secure payment & buyer protection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          <div className="border-b pb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                January 11, 2025
              </span>
            </div>
            <p className="text-sm">
              Very handy, works well so nice not to have all that noise from the
              shoes going around and around in the dryer plus it doesn't end up
              jerking the soul of your shoe out, nicely priced useful!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
