"use client";

import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

interface SuccessMessageProps {
  success?: string;
  onClose: () => void;
  duration?: number;
}

export const SuccessMessage = ({
  success,
  onClose,
  duration,
}: SuccessMessageProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (success) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [success, duration, onClose]);

  if (!success || !isVisible) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4">
      <div className="bg-emerald-500 text-white px-4 py-3 rounded-md flex items-center gap-3 shadow-lg animate-in slide-in-from-top-8">
        <FaCheckCircle className="h-5 w-5 shrink-0" />
        <p className="text-sm font-medium flex-1 text-center whitespace-pre-line">
          {success}
        </p>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="text-white/70 hover:text-white transition-colors"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
