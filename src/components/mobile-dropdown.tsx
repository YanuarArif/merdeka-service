import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useState } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mobileMenuItems } from "@/constants/header-nav-links";

interface MenuItem {
  label: string;
  description: string;
  icon: React.ElementType;
}

interface SubMenu {
  title: string;
  items: MenuItem[];
}

interface NavItem {
  id: number;
  label: string;
  subMenus?: SubMenu[];
  link?: string;
}

interface Props {
  navItems: NavItem[];
}

function MobileDropDown() {
  return (
    <div className="relative gap-5 flex flex-col items-center justify-center py-2 ">
      <NavigationMenuItems />
    </div>
  );
}

function DropdownNavigation({ navItems }: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Function to scroll the menu left or right
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -150 : 150; // Adjust scroll distance as needed
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <main className="relative w-full">
      <div className="relative flex items-center">
        {/* Left Arrow */}
        <button
          className="absolute left-0 z-10 p-2 text-foreground"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Horizontal Menu Items */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 px-10"
        >
          {navItems.map((navItem) => (
            <div key={navItem.label} className="flex-shrink-0">
              {navItem.subMenus ? (
                <button
                  className="text-sm py-2 px-4 flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setOpenMenu(
                      openMenu === navItem.label ? null : navItem.label
                    )
                  }
                >
                  <span>{navItem.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openMenu === navItem.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <a
                  href={navItem.link || "#"}
                  className="text-sm py-2 px-4 text-foreground hover:bg-accent"
                >
                  {navItem.label}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="absolute right-0 z-10 p-2 text-foreground"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Submenu */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 mt-4 bg-background border border-border p-4"
            style={{ borderRadius: 16 }}
          >
            {navItems
              .find((item) => item.label === openMenu)
              ?.subMenus?.map((sub: SubMenu) => (
                <div key={sub.title} className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    {sub.title}
                  </h3>
                  <ul className="space-y-4">
                    {sub.items.map((item: MenuItem) => {
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
                            <div className="leading-5">
                              <p className="text-sm font-medium text-foreground">
                                {item.label}
                              </p>
                              <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                {item.description}
                              </p>
                            </div>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function NavigationMenuItems() {
  return <DropdownNavigation navItems={mobileMenuItems} />;
}

export { MobileDropDown };
