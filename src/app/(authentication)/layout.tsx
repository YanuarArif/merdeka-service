import React from "react";
import { cn } from "@/lib/utils"; // shadcn/ui utility

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      {/* Header */}
      <header className="relative container z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="logo">
              <img
                src="/images/merdeka-logo-cut.png" // Replace with your logo file path
                alt="Merdeka Service"
                className="h-8 w-auto"
              />
            </a>
            <nav className="flex items-center space-x-6">
              <a
                href="/"
                className="text-sm font-light text-gray-600 dark:text-gray-300 relative group logo"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gray-900 dark:bg-white group-hover:w-full transition-all duration-300 ease-out" />
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Background Radial */}
      <div
        className="absolute inset-0 
        bg-[radial-gradient(#e5e7eb_1px,transparent_1.5px)]
        [background-size:15px_15px]
        [mask-image:radial-gradient(ellipse_65%_65%_at_50%_50%,#000_70%,transparent_100%)]
        dark:bg-[#000000] 
        dark:bg-[radial-gradient(#ffffff33_1px,#00091d_1.5px)]
        dark:bg-[size:15px_15px]
        dark:[mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_50%,transparent_100%)]"
      />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden">
        {children}
      </div>
    </div>
  );
}

AuthLayout.getLayout = function getLayout(page: React.ReactNode) {
  return <AuthLayout>{page}</AuthLayout>;
};
