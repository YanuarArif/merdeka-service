import {
  Cpu,
  Globe,
  Eye,
  Shield,
  Rocket,
  Box,
  Search,
  Palette,
  BookOpen,
  FileText,
  Newspaper,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useRef, useState } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define the types for navigation items and submenus
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

function MegaDropDownMenuMobile() {
  return (
    <div className="relative gap-5 flex flex-col items-center justify-center py-2 ">
      <NavigationMenuItems />
    </div>
  );
}

function NavigationMenuItems() {
  const NAV_ITEMS = [
    {
      id: 1,
      label: "Products",
      subMenus: [
        {
          title: "DX Platform",
          items: [
            {
              label: "Previews",
              description: "Helping teams ship 6× faster",
              icon: Cpu,
            },
            {
              label: "AI",
              description: "Powering breakthroughs",
              icon: Search,
            },
          ],
        },
        {
          title: "Managed Infrastructure",
          items: [
            {
              label: "Rendering",
              description: "Fast, scalable, and reliable",
              icon: Globe,
            },
            {
              label: "Observability",
              description: "Trace every step",
              icon: Eye,
            },
            {
              label: "Security",
              description: "Scale without compromising",
              icon: Shield,
            },
          ],
        },
        {
          title: "Open Source",
          items: [
            {
              label: "Next.js",
              description: "The native Next.js platform",
              icon: Rocket,
            },
            {
              label: "Turborepo",
              description: "Speed with Enterprise scale",
              icon: Box,
            },
            {
              label: "AI SDK",
              description: "The AI Toolkit for TypeScript",
              icon: Palette,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      label: "Solutions",
      subMenus: [
        {
          title: "Use Cases",
          items: [
            {
              label: "AI Apps",
              description: "Deploy at the speed of AI",
              icon: Cpu,
            },
            {
              label: "Composable Commerce",
              description: "Power storefronts that convert",
              icon: Box,
            },
            {
              label: "Marketing Sites",
              description: "Launch campaigns fast",
              icon: Rocket,
            },
            {
              label: "Multi-tenant Platforms",
              description: "Scale apps with one codebase",
              icon: Globe,
            },
            {
              label: "Web Apps",
              description: "Ship features, not infrastructure",
              icon: Search,
            },
          ],
        },
        {
          title: "Users",
          items: [
            {
              label: "Platform Engineers",
              description: "Automate away repetition",
              icon: Cpu,
            },
            {
              label: "Design Engineers",
              description: "Deploy for every idea",
              icon: Palette,
            },
          ],
        },
      ],
    },
    {
      id: 3,
      label: "Resources",
      subMenus: [
        {
          title: "Tools",
          items: [
            {
              label: "Resource Center",
              description: "Today's best practices",
              icon: BookOpen,
            },
            {
              label: "Marketplace",
              description: "Extend and automate workflows",
              icon: Search,
            },
            {
              label: "Templates",
              description: "Jumpstart app development",
              icon: FileText,
            },
            {
              label: "Guides",
              description: "Find help quickly",
              icon: BookOpen,
            },
            {
              label: "Partner Finder",
              description: "Get help from solution partners",
              icon: Search,
            },
          ],
        },
        {
          title: "Company",
          items: [
            {
              label: "Customers",
              description: "Trusted by the best teams",
              icon: Newspaper,
            },
            {
              label: "Blog",
              description: "The latest posts and changes",
              icon: FileText,
            },
            {
              label: "Changelog",
              description: "See what shipped",
              icon: BookOpen,
            },
            {
              label: "Press",
              description: "Read the latest news",
              icon: Newspaper,
            },
          ],
        },
      ],
    },
    {
      id: 4,
      label: "Enterprise",
      link: "#",
    },
    {
      id: 5,
      label: "Docs",
      link: "#",
    },
    {
      id: 6,
      label: "Pricing",
      link: "#",
    },
  ];

  return <DropdownNavigation navItems={NAV_ITEMS} />;
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
          className="absolute left-0 z-10 p-2 bg-background text-foreground hover:bg-accent"
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
          className="absolute right-0 z-10 p-2 bg-background text-foreground hover:bg-accent"
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
            className="absolute left-0 right-0 mt-2 bg-background border border-border p-4"
            style={{ borderRadius: 16 }}
          >
            {navItems
              .find((item) => item.label === openMenu)
              ?.subMenus?.map((sub) => (
                <div key={sub.title} className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    {sub.title}
                  </h3>
                  <ul className="space-y-4">
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

export { MegaDropDownMenuMobile };
