"use client";

import axios, { AxiosError } from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api } from "@/lib/api/client";

export type OrderStatus =
  | "Confirmed"
  | "Processing"
  | "Delivered"
  | "Cancelled";

export type CustomerOrder = {
  id: string;
  date: string;
  total: number;
  itemCount: number;
  status: OrderStatus;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
};

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  name: string;
  email: string;
  phone?: string;
  password: string;
};

type AuthResult = {
  success: boolean;
  message?: string;
  user?: Customer;
};

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

type MeResponse = {
  success: boolean;
  customer: Customer | null;
};

type AuthContextType = {
  user: Customer | null;
  orders: CustomerOrder[];
  isReady: boolean;
  isAuthLoading: boolean;

  login: (
    data: LoginData
  ) => Promise<AuthResult>;

  register: (
    data: RegisterData
  ) => Promise<AuthResult>;

  signOut: () => Promise<void>;

  refreshUser:
    () => Promise<Customer | null>;

  addOrder: (
    order: Omit<
      CustomerOrder,
      "id" | "date" | "status"
    >
  ) => CustomerOrder;

  cancelOrder: (
    orderId: string
  ) => boolean;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

const ORDERS_KEY =
  "velvet-crust-orders";

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (axios.isAxiosError(error)) {
    const axiosError =
      error as AxiosError<ApiErrorResponse>;

    return (
      axiosError.response?.data?.message ??
      fallback
    );
  }

  return fallback;
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<Customer | null>(null);

  const [orders, setOrders] =
    useState<CustomerOrder[]>([]);

  const [isReady, setIsReady] =
    useState(false);

  const [
    isAuthLoading,
    setIsAuthLoading,
  ] = useState(false);

  // Restore orders
  useEffect(() => {
    try {
      const rawOrders =
        localStorage.getItem(
          ORDERS_KEY
        );

      if (!rawOrders) {
        return;
      }

      const parsed =
        JSON.parse(rawOrders);

      if (Array.isArray(parsed)) {
        setOrders(parsed);
      }
    } catch (error) {
      console.error(
        "Unable to restore orders:",
        error
      );
    }
  }, []);

  // Save orders
  useEffect(() => {
    try {
      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
      );
    } catch (error) {
      console.error(
        "Unable to save orders:",
        error
      );
    }
  }, [orders]);

  // Restore session
  const refreshUser =
    useCallback(async (): Promise<Customer | null> => {
      try {
        const response =
          await api.get<MeResponse>(
            "/api/auth/me"
          );

        const customer =
          response.data.customer ??
          null;

        setUser(customer);

        return customer;
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status !== 401
        ) {
          console.error(
            "Unable to restore session:",
            error
          );
        }

        setUser(null);

        return null;
      }
    }, []);

  useEffect(() => {
    let active = true;

    const initialize =
      async () => {
        try {
          await refreshUser();
        } catch (error) {
          console.error(
            "Auth initialization error:",
            error
          );
        } finally {
          if (active) {
            setIsReady(true);
          }
        }
      };

    void initialize();

    return () => {
      active = false;
    };
  }, [refreshUser]);

  // Login
  const login = useCallback(
    async (
      data: LoginData
    ): Promise<AuthResult> => {
      if (isAuthLoading) {
        return {
          success: false,
          message: "Please wait.",
        };
      }

      setIsAuthLoading(true);

      try {
        await api.post(
          "/api/auth/login",
          {
            email: data.email
              .trim()
              .toLowerCase(),

            password:
              data.password,
          }
        );

        const customer =
          await refreshUser();

        if (!customer) {
          return {
            success: false,
            message:
              "Unable to verify your session.",
          };
        }

        return {
          success: true,
          user: customer,
        };
      } catch (error) {
        return {
          success: false,

          message: getErrorMessage(
            error,
            "Unable to sign in. Please try again."
          ),
        };
      } finally {
        setIsAuthLoading(false);
      }
    },
    [
      isAuthLoading,
      refreshUser,
    ]
  );

  // Register
  const register = useCallback(
    async (
      data: RegisterData
    ): Promise<AuthResult> => {
      if (isAuthLoading) {
        return {
          success: false,
          message: "Please wait.",
        };
      }

      setIsAuthLoading(true);

      try {
        const email =
          data.email
            .trim()
            .toLowerCase();

        await api.post(
          "/api/auth/register",
          {
            name: data.name.trim(),

            email,

            phone:
              data.phone?.trim() ||
              undefined,

            password:
              data.password,
          }
        );

        // Login after registration
        await api.post(
          "/api/auth/login",
          {
            email,
            password:
              data.password,
          }
        );

        const customer =
          await refreshUser();

        if (!customer) {
          return {
            success: false,
            message:
              "Account created, but sign in could not be completed.",
          };
        }

        return {
          success: true,
          user: customer,
        };
      } catch (error) {
        return {
          success: false,

          message: getErrorMessage(
            error,
            "Unable to create account. Please try again."
          ),
        };
      } finally {
        setIsAuthLoading(false);
      }
    },
    [
      isAuthLoading,
      refreshUser,
    ]
  );

  // Logout
  const signOut =
    useCallback(
      async (): Promise<void> => {
        if (isAuthLoading) {
          return;
        }

        setIsAuthLoading(true);

        try {
          await api.post(
            "/api/auth/logout"
          );
        } catch (error) {
          console.error(
            "Logout error:",
            error
          );
        } finally {
          setUser(null);
          setIsAuthLoading(false);
        }
      },
      [isAuthLoading]
    );

  // Temporary local orders
  const addOrder = useCallback(
    (
      order: Omit<
        CustomerOrder,
        "id" | "date" | "status"
      >
    ): CustomerOrder => {
      const completedOrder: CustomerOrder =
        {
          ...order,

          id: `VC-${Date.now()
            .toString()
            .slice(-6)}`,

          date:
            new Date().toISOString(),

          status: "Confirmed",
        };

      setOrders((current) => [
        completedOrder,
        ...current,
      ]);

      return completedOrder;
    },
    []
  );

  const cancelOrder = useCallback(
    (orderId: string): boolean => {
      const order = orders.find(
        (item) =>
          item.id === orderId
      );

      if (!order) {
        return false;
      }

      if (
        order.status !== "Confirmed"
      ) {
        return false;
      }

      setOrders((current) =>
        current.map((item) =>
          item.id === orderId
            ? {
                ...item,
                status:
                  "Cancelled",
              }
            : item
        )
      );

      return true;
    },
    [orders]
  );

  const value =
    useMemo<AuthContextType>(
      () => ({
        user,
        orders,
        isReady,
        isAuthLoading,

        login,
        register,
        signOut,
        refreshUser,

        addOrder,
        cancelOrder,
      }),
      [
        user,
        orders,
        isReady,
        isAuthLoading,
        login,
        register,
        signOut,
        refreshUser,
        addOrder,
        cancelOrder,
      ]
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}