import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { phones } from "../app/(main)/data/phone";

export default function SmartphoneDeals() {
  const desktopPhones = phones.slice(0, 5); // Select only the first 5 phones for desktop view

  return (
    <section className="w-full py-6">
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">
            Grab the best deal on{" "}
            <span className="text-blue-500">Smartphones</span>
          </h2>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-blue-500 flex items-center"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {desktopPhones.map(
            (
              phone // Use desktopPhones here
            ) => (
              <Card
                key={phone.id}
                className="hover:shadow-lg hover:border-blue-400 hover:cursor-pointer transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="relative">
                    <div className="absolute top-0 left-0 z-10 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg">
                      {phone.discount}% OFF
                    </div>
                    <Image
                      src={phone.image || "/placeholder.svg"}
                      alt={phone.name}
                      width={200}
                      height={200}
                      className="mx-auto mb-4"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">{phone.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold">
                        ${phone.discountedPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${phone.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-green-600 text-sm">
                      Save - $
                      {(
                        phone.originalPrice - phone.discountedPrice
                      ).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </section>
  );
}
