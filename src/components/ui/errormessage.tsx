"use client";

import { FaExclamationTriangle } from "react-icons/fa";
import { useEffect, useState } from "react";

interface ErrorMessageProps {
  error?: string;
  onClose: () => void;
  duration?: number;
}

export const ErrorMessage = ({
  error,
  onClose,
  duration,
}: ErrorMessageProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [error, duration, onClose]);

  if (!error || !isVisible) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4">
      <div className="bg-destructive text-destructive-foreground px-4 py-3 rounded-md flex items-center gap-3 shadow-lg animate-in slide-in-from-top-8">
        <FaExclamationTriangle className="h-5 w-5 shrink-0" />
        <p className="text-sm font-medium flex-1 text-center whitespace-pre-line">
          {error}
        </p>
      </div>
    </div>
  );
};
