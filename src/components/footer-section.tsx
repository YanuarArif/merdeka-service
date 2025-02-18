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
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        {/* Logo */}
        <div className="my-2 gap-4 flex flex-col md:flex-row justify-between">
          <div>
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
                  >
                    <Facebook className="h-4 w-4" />
                    <span className="sr-only">Facebook</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Follow us on Facebook</p>
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
                  <p>Follow us on Twitter</p>
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
                  <p>Follow us on Instagram</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {/* Grid */}
        <div className="grid md:grid-cols-1 lg:grid-cols-7">
          {/* Grid/Column 1 */}
          <div
            className="relative flex flex-col items-start
            w-full gap-4 col-span-1 lg:col-span-2"
          >
            <div>
              <div className="flex gap-2">
                <div>
                  <CalendarHeart />
                </div>
                <div>
                  <p>Jam Buka Toko</p>
                  <p>Senin - Jumat: 08.00 - 16.00</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  <FaWhatsapp size={25} />
                </div>
                <div>
                  <p>Whatsapp</p>
                  <p>0895 3767 06611</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  <MapPin />
                </div>
                <div>
                  <p>Alamat Toko</p>
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
                  <p>Email</p>
                  <p>merdekaservice@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          {/* Grid/Column 2 - Jasa Service */}
          <div>
            {/* Accordion Version (Mobile) */}
            <Accordion type="single" collapsible className="block lg:hidden">
              <AccordionItem value="item-1">
                <AccordionTrigger>Jasa Service</AccordionTrigger>
                <AccordionContent>
                  <nav className="space-y-2 text-sm">
                    <a
                      href="#"
                      className="block transition-colors hover:text-primary"
                    >
                      Home
                    </a>
                    <a
                      href="#"
                      className="block transition-colors hover:text-primary"
                    >
                      About Us
                    </a>
                    <a
                      href="#"
                      className="block transition-colors hover:text-primary"
                    >
                      Services
                    </a>
                    <a
                      href="#"
                      className="block transition-colors hover:text-primary"
                    >
                      Products
                    </a>
                    <a
                      href="#"
                      className="block transition-colors hover:text-primary"
                    >
                      Contact
                    </a>
                  </nav>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* Regular Version (Desktop) */}
            <div className="hidden lg:block">
              <h3 className="mb-4 text-lg font-semibold">Jasa Service</h3>
              <nav className="space-y-2 text-sm">
                <a
                  href="#"
                  className="block transition-colors hover:text-primary"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="block transition-colors hover:text-primary"
                >
                  About Us
                </a>
                <a
                  href="#"
                  className="block transition-colors hover:text-primary"
                >
                  Services
                </a>
                <a
                  href="#"
                  className="block transition-colors hover:text-primary"
                >
                  Products
                </a>
                <a
                  href="#"
                  className="block transition-colors hover:text-primary"
                >
                  Contact
                </a>
              </nav>
            </div>
          </div>
          {/* Grid/Column 3 - Laptop */}
          <div>
            {/* Accordion Version (Mobile) */}
            <Accordion type="single" collapsible className="block lg:hidden">
              <AccordionItem value="item-2">
                <AccordionTrigger>Laptop</AccordionTrigger>
                <AccordionContent>
                  <address className="space-y-2 text-sm not-italic"></address>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* Regular Version (Desktop) */}
            <div className="hidden lg:block">
              <h3 className="mb-4 text-lg font-semibold">Laptop</h3>
              <address className="space-y-2 text-sm not-italic"></address>
            </div>
          </div>
          {/* Grid/Column 4 - Smartphone */}
          <div className="relative">
            {/* Accordion Version (Mobile) */}
            <Accordion type="single" collapsible className="block lg:hidden">
              <AccordionItem value="item-3">
                <AccordionTrigger>Smartphone</AccordionTrigger>
                <AccordionContent>
                  <h3 className="mb-4 text-lg font-semibold">Smartphone</h3>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* Regular Version (Desktop) */}
            <div className="hidden lg:block">
              <h3 className="mb-4 text-lg font-semibold">Smartphone</h3>
            </div>
          </div>
          {/* Grid/Column 5 - Printer */}
          <div className="relative">
            {/* Accordion Version (Mobile) */}
            <Accordion type="single" collapsible className="block lg:hidden">
              <AccordionItem value="item-4">
                <AccordionTrigger>Printer</AccordionTrigger>
                <AccordionContent>
                  <h3 className="mb-4 text-lg font-semibold">Printer</h3>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* Regular Version (Desktop) */}
            <div className="hidden lg:block">
              <h3 className="mb-4 text-lg font-semibold">Printer</h3>
            </div>
          </div>
          {/* Grid/Column 6 - Info Toko */}
          <div className="relative">
            {/* Accordion Version (Mobile) */}
            <Accordion type="single" collapsible className="block lg:hidden">
              <AccordionItem value="item-4">
                <AccordionTrigger>Info Toko</AccordionTrigger>
                <AccordionContent>
                  <h3 className="mb-4 text-lg font-semibold">Info Toko</h3>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* Regular Version (Desktop) */}
            <div className="hidden lg:block">
              <h3 className="mb-4 text-lg font-semibold">Info Toko</h3>
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
