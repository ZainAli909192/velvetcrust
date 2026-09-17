"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  CartItem,
  CartProduct,
} from "@/types/cart";

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isCartReady: boolean;

  addItem: (
    product: CartProduct
  ) => void;

  removeItem: (
    id: string
  ) => void;

  increaseQuantity: (
    id: string
  ) => void;

  decreaseQuantity: (
    id: string
  ) => void;

  clearCart: () => void;

  isInCart: (
    id: string
  ) => boolean;

  syncCart: (
    products: CartProduct[]
  ) => void;
};

const CartContext =
  createContext<
    CartContextType | undefined
  >(undefined);

const STORAGE_KEY =
  "velvet-crust-cart";

const MAX_QUANTITY = 20;
const MAX_CART_ITEMS = 10;

function isValidCartItem(
  value: unknown
): value is CartItem {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const item =
    value as Partial<CartItem>;

  const hasValidId =
    typeof item.id === "string" &&
    item.id.trim().length > 0;

  return (
    hasValidId &&
    typeof item.name ===
      "string" &&
    typeof item.slug ===
      "string" &&
    typeof item.description ===
      "string" &&
    typeof item.image ===
      "string" &&
    typeof item.price ===
      "number" &&
    Number.isFinite(
      item.price
    ) &&
    item.price >= 0 &&
    typeof item.quantity ===
      "number" &&
    Number.isInteger(
      item.quantity
    ) &&
    item.quantity >= 1 &&
    item.quantity <=
      MAX_QUANTITY
  );
}

function sanitizeCart(
  value: unknown
): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const uniqueItems =
    new Map<
      string,
      CartItem
    >();

  for (
    const item of value
      .filter(isValidCartItem)
      .slice(
        0,
        MAX_CART_ITEMS
      )
  ) {
    if (
      !uniqueItems.has(
        item.id
      )
    ) {
      uniqueItems.set(
        item.id,
        item
      );
    }
  }

  return Array.from(
    uniqueItems.values()
  );
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    items,
    setItems,
  ] =
    useState<CartItem[]>([]);

  const [
    isCartReady,
    setIsCartReady,
  ] = useState(false);

  useEffect(() => {
    try {
      const stored =
        window.localStorage.getItem(
          STORAGE_KEY
        );

      if (!stored) {
        return;
      }

      const parsed: unknown =
        JSON.parse(stored);

      setItems(
        sanitizeCart(parsed)
      );
    } catch (error) {
      console.error(
        "Unable to load cart:",
        error
      );

      window.localStorage.removeItem(
        STORAGE_KEY
      );
    } finally {
      setIsCartReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isCartReady) {
      return;
    }

    try {
      if (
        items.length === 0
      ) {
        window.localStorage.removeItem(
          STORAGE_KEY
        );

        return;
      }

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error(
        "Unable to save cart:",
        error
      );
    }
  }, [
    items,
    isCartReady,
  ]);

  const addItem =
    useCallback(
      (
        product: CartProduct
      ) => {
        if (
          !product.id ||
          !product.name ||
          !product.slug ||
          !product.image ||
          !Number.isFinite(
            product.price
          ) ||
          product.price < 0
        ) {
          return;
        }

        setItems(
          (current) => {
            const existing =
              current.find(
                (item) =>
                  item.id ===
                  product.id
              );

            if (existing) {
              return current.map(
                (item) =>
                  item.id ===
                  product.id
                    ? {
                        ...item,
                        quantity:
                          Math.min(
                            item.quantity +
                              1,
                            MAX_QUANTITY
                          ),
                      }
                    : item
              );
            }

            if (
              current.length >=
              MAX_CART_ITEMS
            ) {
              return current;
            }

            return [
              ...current,
              {
                ...product,
                quantity: 1,
              },
            ];
          }
        );
      },
      []
    );

  const removeItem =
    useCallback(
      (
        id: string
      ) => {
        setItems(
          (current) =>
            current.filter(
              (item) =>
                item.id !== id
            )
        );
      },
      []
    );

  const increaseQuantity =
    useCallback(
      (
        id: string
      ) => {
        setItems(
          (current) =>
            current.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      quantity:
                        Math.min(
                          item.quantity +
                            1,
                          MAX_QUANTITY
                        ),
                    }
                  : item
            )
        );
      },
      []
    );

  const decreaseQuantity =
    useCallback(
      (
        id: string
      ) => {
        setItems(
          (current) =>
            current
              .map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,
                        quantity:
                          item.quantity -
                          1,
                      }
                    : item
              )
              .filter(
                (item) =>
                  item.quantity >
                  0
              )
        );
      },
      []
    );

  const clearCart =
    useCallback(() => {
      setItems([]);
    }, []);

  const isInCart =
    useCallback(
      (
        id: string
      ) => {
        return items.some(
          (item) =>
            item.id === id
        );
      },
      [items]
    );

  const syncCart =
    useCallback(
      (
        products: CartProduct[]
      ) => {
        const productsById =
          new Map(
            products.map(
              (product) => [
                product.id,
                product,
              ]
            )
          );

        setItems(
          (currentItems) =>
            currentItems
              .map(
                (item) => {
                  const product =
                    productsById.get(
                      item.id
                    );

                  if (
                    !product
                  ) {
                    return null;
                  }

                  return {
                    ...product,
                    quantity:
                      Math.min(
                        Math.max(
                          item.quantity,
                          1
                        ),
                        MAX_QUANTITY
                      ),
                  };
                }
              )
              .filter(
                (
                  item
                ): item is CartItem =>
                  item !==
                  null
              )
      );
    },
    []
  );

  const totalItems =
    useMemo(() => {
      return items.reduce(
        (
          total,
          item
        ) =>
          total +
          item.quantity,
        0
      );
    }, [items]);

  const subtotal =
    useMemo(() => {
      return items.reduce(
        (
          total,
          item
        ) =>
          total +
          item.price *
            item.quantity,
        0
      );
    }, [items]);

  const value =
    useMemo(
      () => ({
        items,
        totalItems,
        subtotal,
        isCartReady,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isInCart,
        syncCart,
      }),
      [
        items,
        totalItems,
        subtotal,
        isCartReady,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isInCart,
        syncCart,
      ]
    );

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}