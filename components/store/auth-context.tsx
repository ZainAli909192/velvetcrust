"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CustomerOrder = {
  id: string;
  date: string;
  total: number;
  itemCount: number;
  status: "Confirmed";
};

type Customer = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: Customer | null;
  orders: CustomerOrder[];
  isReady: boolean;
  signIn: (customer: Customer) => void;
  signOut: () => void;
  addOrder: (order: Omit<CustomerOrder, "id" | "date" | "status">) => CustomerOrder;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_KEY = "velvet-crust-customer";
const ORDERS_KEY = "velvet-crust-orders";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let savedUser: Customer | null = null;
    let savedOrders: CustomerOrder[] = [];

    try {
      const rawUser = localStorage.getItem(USER_KEY);
      const rawOrders = localStorage.getItem(ORDERS_KEY);
      if (rawUser) savedUser = JSON.parse(rawUser);
      if (rawOrders) {
        const parsed = JSON.parse(rawOrders);
        if (Array.isArray(parsed)) savedOrders = parsed;
      }
    } catch (error) {
      console.error("Unable to restore customer session:", error);
    }

    const hydrationTimer = window.setTimeout(() => {
      setUser(savedUser);
      setOrders(savedOrders);
      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [isReady, orders, user]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    orders,
    isReady,
    signIn: setUser,
    signOut: () => setUser(null),
    addOrder: (order) => {
      const completedOrder: CustomerOrder = {
        ...order,
        id: `VC-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        status: "Confirmed",
      };
      setOrders((current) => [completedOrder, ...current]);
      return completedOrder;
    },
  }), [isReady, orders, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
