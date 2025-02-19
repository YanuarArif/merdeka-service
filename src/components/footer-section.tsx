"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarHeart,
  Facebook,
  Instagram,
  Linkedin,
  MailCheck,
  MapPin,
  Moon,
  Send,
  Sun,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";

// Import Shadcn Accordion Components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  infoToko,
  jasaServices,
  laptops,
  printers,
  smartphones,
} from "@/constants/footerlinks";
import { Separator } from "./ui/separator";

function FooterComponent() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <footer className="container relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="py-10">
        {/* Logo & Social Media */}
        <div className="my-2 gap-4 flex flex-col lg:flex-row justify-between">
          <div className="flex items-center justify-center lg:items-start">
            <Image
              className="items-center"
              src="/images/merdeka-logo-cut.png"
              alt="Logo"
              width={200}
              height={100}
            />
          </div>
          {/* Social Media */}
          <div className="flex space-x-4 justify-center items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() =>
                      window.open(
                        "https://www.facebook.com/profile.php?id=100047452784576",
                        "_blank"
                      )
                    }
                  >
                    <Facebook className="h-4 w-4" />
                    <span className="sr-only">Facebook</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ikuti kami di Facebook</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Twitter className="h-4 w-4" />
                    <span className="sr-only">Twitter</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Follow Twitter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Instagram className="h-4 w-4" />
                    <span className="sr-only">Instagram</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ikuti kami di Instagram</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Separator className="my-8" />
        {/* Grid */}
        <div className="grid md:grid-cols-1 lg:grid-cols-7">
          {/* Grid/Column 1 */}
          <div
            className="relative flex flex-col items-start
            w-full gap-4 col-span-1 lg:col-span-2 mb-4 lg:mb-0 text-base"
          >
            <div className="mr-4 xl:mr-0">
              <div className="flex gap-2">
                <div>
                  <CalendarHeart />
                </div>
                <div>
                  <p className="font-semibold">Jam Buka Toko</p>
                  <p>Senin - Jumat: 08.00 - 16.00</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  <FaWhatsapp size={25} />
                </div>
                <div>
                  <p className="font-semibold">Whatsapp</p>
                  <p>0895 3767 06611</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  <MapPin />
                </div>
                <div>
                  <p className="font-semibold">Alamat Toko</p>
                  <p>
                    Jl. Mekarjaya no 08, Kec. Bobotsari, Kab. Purbalingga (Barat
                    SMP N 1 Bobotsari)
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  <MailCheck />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p>merdekaservice@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          {/* Grid/Column 2 - Jasa Service */}
          <div className="lg:grid hidden">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Jasa Service</h3>
              <nav className="space-y-2 text-sm">
                {jasaServices.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex flex-col transition-colors hover:text-blue-500 items-start"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
          {/* Grid/Column 3 - Laptop */}
          <div className="lg:grid hidden">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Laptops</h3>
              <nav className="space-y-2 text-sm">
                {laptops.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex flex-col transition-colors hover:text-blue-500 items-start"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
          {/* Grid/Column 4 - Smartphone */}
          <div className="lg:grid hidden">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Smartphone</h3>
              <nav className="space-y-2 text-sm">
                {smartphones.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex flex-col transition-colors hover:text-blue-500 items-start"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
          {/* Grid/Column 5 - Printer */}
          <div className="lg:grid hidden">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Printer</h3>
              <nav className="space-y-2 text-sm">
                {printers.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex flex-col transition-colors hover:text-blue-500 items-start"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
          {/* Grid/Column 6 - Info Toko */}
          <div className="lg:grid hidden">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Info Toko</h3>
              <nav className="space-y-2 text-sm">
                {infoToko.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex flex-col transition-colors hover:text-blue-500 items-start"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 Merdeka Service. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm items-center">
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Cookie Settings
            </a>
            {/* Theme toggle */}
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Moon className="h-4 w-4" />
              <Label htmlFor="dark-mode" className="sr-only">
                Toggle dark mode
              </Label>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export { FooterComponent };
