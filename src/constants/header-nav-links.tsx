import { SideMobileNavItem } from "@/types/navigation";
import {
  Book,
  Menu,
  Sunset,
  Trees,
  Zap,
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
} from "lucide-react";

export const logo = {
  url: "/",
  src: "/images/merdeka-logo-cut.png",
  alt: "logo",
  title: "Merdeka Service",
};

//^ Menu Link untuk mobile navigation
export const menu: SideMobileNavItem[] = [
  { title: "Home", url: "#" },
  {
    title: "Products",
    url: "#",
    items: [
      {
        title: "Blog",
        description: "The latest industry news, updates, and info",
        icon: <Book className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Company",
        description: "Our mission is to innovate and empower the world",
        icon: <Trees className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Careers",
        description: "Browse job listing and discover our workspace",
        icon: <Sunset className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Support",
        description:
          "Get in touch with our support team or visit our community forums",
        icon: <Zap className="size-5 shrink-0" />,
        url: "#",
      },
    ],
  },
  {
    title: "Resources",
    url: "#",
    items: [
      {
        title: "Help Center",
        description: "Get all the answers you need right here",
        icon: <Zap className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Contact Us",
        description: "We are here to help you with any questions you have",
        icon: <Sunset className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Status",
        description: "Check the current status of our services and APIs",
        icon: <Trees className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Terms of Service",
        description: "Our terms and conditions for using our services",
        icon: <Book className="size-5 shrink-0" />,
        url: "#",
      },
    ],
  },
  {
    title: "Pricing",
    url: "#",
  },
  {
    title: "Blog",
    url: "#",
  },
  {
    title: "Makanan",
    url: "#",
    items: [
      {
        title: "Blog",
        description: "The latest industry news, updates, and info",
        icon: <Book className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Company",
        description: "Our mission is to innovate and empower the world",
        icon: <Trees className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Careers",
        description: "Browse job listing and discover our workspace",
        icon: <Sunset className="size-5 shrink-0" />,
        url: "#",
      },
      {
        title: "Support",
        description:
          "Get in touch with our support team or visit our community forums",
        icon: <Zap className="size-5 shrink-0" />,
        url: "#",
      },
    ],
  },
];

export const mobileExtraLinks = [
  { name: "Press", url: "#" },
  { name: "Contact", url: "#" },
  { name: "Imprint", url: "#" },
  { name: "Sitemap", url: "#" },
];

export const auth = {
  login: { text: "Log in", url: "/login" },
  signup: { text: "Sign up", url: "/registrasi" },
};

export const mobileMenuItems = [
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
];

// ///////////////////////////////////////////////////////////////////////

//^ Menu Link untuk desktop navigation

export const desktopMenuItems = [
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
