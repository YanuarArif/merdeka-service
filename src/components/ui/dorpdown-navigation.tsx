import { useState, useEffect, useRef } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export function DropdownNavigation({ navItems }: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isHover, setIsHover] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showArrows, setShowArrows] = useState({ left: false, right: false });
  const navRef = useRef<HTMLUListElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('li[class*="relative"]')
      ) {
        setOpenMenu(null);
      }
    };

    if (isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, openMenu]);

  const checkScroll = () => {
    if (!navRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
    setShowArrows({
      left: scrollLeft > 0,
      right: scrollLeft < scrollWidth - clientWidth - 1,
    });
  };

  const scroll = (direction: "left" | "right") => {
    navRef.current?.scrollBy({
      left: direction === "right" ? 200 : -200,
      behavior: "smooth",
    });
  };

  const handleMobileMenu = (label: string) => {
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  return (
    <main className="relative w-full flex items-start md:items-center justify-center px-4">
      <div className="relative gap-5 flex flex-col items-center justify-center w-full">
        {isMobile && showArrows.left && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 p-1"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {isMobile && showArrows.right && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 p-1"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <div className="relative w-full overflow-hidden">
          <ul
            ref={navRef}
            onScroll={checkScroll}
            className="relative flex space-x-0 overflow-x-auto scrollbar-hide md:overflow-visible"
          >
            {navItems.map((navItem) => (
              <li
                key={navItem.label}
                className="relative flex-shrink-0"
                onMouseEnter={
                  !isMobile ? () => setOpenMenu(navItem.label) : undefined
                }
                onMouseLeave={!isMobile ? () => setOpenMenu(null) : undefined}
              >
                <button
                  className="text-sm py-1.5 px-4 flex cursor-pointer group transition-colors duration-300 items-center justify-center gap-1 text-muted-foreground hover:text-foreground relative"
                  onClick={() => isMobile && handleMobileMenu(navItem.label)}
                  onMouseEnter={() => !isMobile && setIsHover(navItem.id)}
                  onMouseLeave={() => !isMobile && setIsHover(null)}
                >
                  <span>{navItem.label}</span>
                  {navItem.subMenus && (
                    <ChevronDown
                      className={`h-4 w-4 group-hover:rotate-180 duration-300 transition-transform
                        ${openMenu === navItem.label ? "rotate-180" : ""}`}
                    />
                  )}
                  {(isHover === navItem.id || openMenu === navItem.label) && (
                    <motion.div
                      layoutId="hover-bg"
                      className="absolute inset-0 size-full bg-primary/10"
                      style={{ borderRadius: 99 }}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {openMenu === navItem.label && navItem.subMenus && (
                    <div
                      ref={dropdownRef}
                      className={`w-auto ${isMobile ? "fixed inset-x-4 top-[calc(100%+16px)]" : "absolute left-0 top-full"} pt-2 z-[999]`}
                    >
                      <motion.div
                        className="bg-background border border-border p-4 w-full md:w-max shadow-lg"
                        style={{ borderRadius: 16 }}
                        layoutId="menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="w-fit shrink-0 flex space-x-9 overflow-hidden">
                          {navItem.subMenus.map((sub) => (
                            <motion.div
                              layout
                              className="w-full"
                              key={sub.title}
                            >
                              <h3 className="mb-4 text-sm font-medium capitalize text-muted-foreground">
                                {sub.title}
                              </h3>
                              <ul className="space-y-6">
                                {sub.items.map((item) => {
                                  const Icon = item.icon;
                                  return (
                                    <li key={item.label}>
                                      <a
                                        href="#"
                                        className="flex items-start space-x-3 group"
                                      >
                                        <div className="border border-border text-foreground rounded-md flex items-center justify-center size-9 shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                                          <Icon className="h-5 w-5 flex-none" />
                                        </div>
                                        <div className="leading-5 w-max">
                                          <p className="text-sm font-medium text-foreground shrink-0">
                                            {item.label}
                                          </p>
                                          <p className="text-xs text-muted-foreground shrink-0 group-hover:text-foreground transition-colors duration-300">
                                            {item.description}
                                          </p>
                                        </div>
                                      </a>
                                    </li>
                                  );
                                })}
                              </ul>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

// Keep existing Props type

type Props = {
  id: number;
  label: string;
  subMenus?: {
    title: string;
    items: {
      label: string;
      description: string;
      icon: React.ElementType;
    }[];
  }[];
  link?: string;
};
