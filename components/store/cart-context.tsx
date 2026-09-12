"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  CartItem,
  CartProduct,
} from "@/types/cart";

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;

  addItem: (product: CartProduct) => void;
  removeItem: (id: string | number) => void;

  increaseQuantity: (id: string | number) => void;
  decreaseQuantity: (id: string | number) => void;

  clearCart: () => void;

  isInCart: (id: string | number) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

const STORAGE_KEY = "velvet-crust-cart";

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

//  load cart 

  useEffect(() => {
    let storedItems: CartItem[] = [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          storedItems = parsed;
        }
      }
    } catch (error) {
      console.error("Unable to load cart:", error);
    }

    const hydrationTimer = window.setTimeout(() => {
      setItems(storedItems);
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

//   save cart 

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    );
  }, [items, mounted]);

//   add into cart 

  const addItem = (product: CartProduct) => {
    setItems((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

// remove from cart 

  const removeItem = (id: string | number) => {
    setItems((current) =>
      current.filter((item) => item.id !== id)
    );
  };

//  increase 

  const increaseQuantity = (
    id: string | number
  ) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

//   decrease  

  const decreaseQuantity = (
    id: string | number
  ) => {
    setItems((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (id: string | number) =>
    items.some((item) => item.id === id);

  const totalItems = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,

        addItem,
        removeItem,

        increaseQuantity,
        decreaseQuantity,

        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
