"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { AnimatePresence } from "framer-motion";

import Toast, {
  type ToastType,
} from "@/components/ui/toast";

type ToastOptions = {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
};

type ActiveToast = ToastOptions & {
  id: number;
};

type ToastContextType = {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
};

const ToastContext =
  createContext<ToastContextType | null>(null);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toast, setToast] =
    useState<ActiveToast | null>(null);

  const timerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setToast(null);
  }, []);

  const showToast = useCallback(
    ({
      type = "success",
      title,
      message,
      duration = 2400,
    }: ToastOptions) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setToast({
        id: Date.now(),
        type,
        title,
        message,
        duration,
      });

      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        hideToast,
      }}
    >
      {children}

      <div
        className="
          pointer-events-none
          fixed
          bottom-[105px]
          left-1/2
          z-[1000]
          w-[calc(100%-40px)]
          max-w-[390px]
          -translate-x-1/2

          lg:bottom-8
          lg:left-auto
          lg:right-8
          lg:translate-x-0
        "
      >
        <AnimatePresence mode="wait">
          {toast && (
            <div
              key={toast.id}
              className="pointer-events-auto"
            >
              <Toast
                type={toast.type ?? "success"}
                title={toast.title}
                message={toast.message}
                onClose={hideToast}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
}