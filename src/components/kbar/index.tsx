"use client";
import { sidebarItems } from "@/constants/data";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from "kbar";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import RenderResults from "./render-result";
import useThemeSwitching from "./use-theme-switching";

export default function KBar({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const navigateTo = (url: string) => {
    router.push(url);
  };

  // These action are for the navigation
  const actions = useMemo(
    () =>
      sidebarItems.flatMap((sidebarItems) => {
        // Only include base action if the sidebarItems has a real URL and is not just a container
        const baseAction =
          sidebarItems.url !== "#"
            ? {
                id: `${sidebarItems.title.toLowerCase()}Action`,
                name: sidebarItems.title,
                shortcut: sidebarItems.shortcut,
                keywords: sidebarItems.title.toLowerCase(),
                section: "Navigation",
                subtitle: `Go to ${sidebarItems.title}`,
                perform: () => navigateTo(sidebarItems.url),
              }
            : null;

        // Map child items into actions
        const childActions =
          sidebarItems.items?.map((childItem) => ({
            id: `${childItem.title.toLowerCase()}Action`,
            name: childItem.title,
            shortcut: childItem.shortcut,
            keywords: childItem.title.toLowerCase(),
            section: sidebarItems.title,
            subtitle: `Go to ${childItem.title}`,
            perform: () => navigateTo(childItem.url),
          })) ?? [];

        // Return only valid actions (ignoring null base actions for containers)
        return baseAction ? [baseAction, ...childActions] : childActions;
      }),
    []
  );

  return (
    <KBarProvider actions={actions}>
      <KBarComponent>{children}</KBarComponent>
    </KBarProvider>
  );
}
const KBarComponent = ({ children }: { children: React.ReactNode }) => {
  useThemeSwitching();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className="scrollbar-hide fixed inset-0 z-[99999] bg-black/80 !p-0 backdrop-blur-sm">
          <KBarAnimator className="relative !mt-64 w-full max-w-[600px] !-translate-y-12 overflow-hidden rounded-lg border bg-background text-foreground shadow-lg">
            <div className="bg-background">
              <div className="border-x-0 border-b-2">
                <KBarSearch className="w-full border-none bg-background px-6 py-4 text-lg outline-none focus:outline-none focus:ring-0 focus:ring-offset-0" />
              </div>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};
