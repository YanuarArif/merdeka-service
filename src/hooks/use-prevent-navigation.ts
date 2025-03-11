// src/hooks/use-prevent-navigation.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface UsePreventNavigationOptions {
  shouldPrevent: boolean;
  onNavigate?: () => void;
  message?: string;
}

export function usePreventNavigation({
  shouldPrevent,
  onNavigate,
  message = "Perubahan yang Anda buat akan hilang. Apakah Anda yakin ingin meninggalkan halaman ini?",
}: UsePreventNavigationOptions) {
  const [showDialog, setShowDialog] = useState(false);
  const [nextRoute, setNextRoute] = useState<string | null>(null);
  const router = useRouter();
  const originalPush = useRef(router.push).current; // Store the original push method

  // Override router.push to intercept navigation
  useEffect(() => {
    if (!shouldPrevent) return;

    const customPush = (href: string, ...args: any[]) => {
      if (shouldPrevent) {
        setNextRoute(href);
        setShowDialog(true);
        return; // Prevent immediate navigation
      }
      originalPush(href, ...args);
    };

    // Replace the router.push method
    router.push = customPush as any;

    // Handle browser back/forward navigation
    const handlePopState = (e: PopStateEvent) => {
      if (shouldPrevent) {
        e.preventDefault();
        setShowDialog(true);
        // Push the current route back to prevent navigation
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    // Handle page unload (e.g., closing tab)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldPrevent) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup
    return () => {
      router.push = originalPush; // Restore original push method
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldPrevent, message, router, originalPush]);

  const confirmNavigation = useCallback(() => {
    if (onNavigate) {
      onNavigate();
    }
    setShowDialog(false);
    if (nextRoute) {
      originalPush(nextRoute); // Use original push to avoid infinite loop
    } else {
      originalPush("/dashboard/products"); // Default fallback route
    }
    setNextRoute(null);
  }, [onNavigate, nextRoute, originalPush]);

  const cancelNavigation = useCallback(() => {
    setShowDialog(false);
    setNextRoute(null);
    // Push the current route back to prevent navigation
    window.history.pushState(null, "", window.location.pathname);
  }, []);

  return {
    showDialog,
    setShowDialog,
    confirmNavigation,
    cancelNavigation,
  };
}
