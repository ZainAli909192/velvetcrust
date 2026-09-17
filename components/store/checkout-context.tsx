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

import {
  emptyCheckoutDetails,
  type CheckoutDetails,
} from "@/types/checkout";

type CheckoutContextType = {
  details: CheckoutDetails;
  isCheckoutReady: boolean;

  saveDetails: (
    details: CheckoutDetails
  ) => void;

  clearCheckout: () => void;
};

const CheckoutContext =
  createContext<
    CheckoutContextType | undefined
  >(undefined);

const STORAGE_KEY =
  "velvet-crust-checkout";

function getSafeString(
  value: unknown,
  maxLength: number
) {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value
    .trim()
    .slice(
      0,
      maxLength
    );
}

function sanitizeCheckoutDetails(
  value: unknown
): CheckoutDetails {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return {
      ...emptyCheckoutDetails,
    };
  }

  const data =
    value as Partial<CheckoutDetails>;

  return {
    fullName:
      getSafeString(
        data.fullName,
        100
      ),

    email:
      getSafeString(
        data.email,
        254
      ),

    phone:
      getSafeString(
        data.phone,
        30
      ),

    emirate:
      getSafeString(
        data.emirate,
        50
      ),

    area:
      getSafeString(
        data.area,
        100
      ),

    addressLine:
      getSafeString(
        data.addressLine,
        200
      ),

    building:
      getSafeString(
        data.building,
        100
      ),

    apartment:
      getSafeString(
        data.apartment,
        50
      ),

    notes:
      getSafeString(
        data.notes,
        500
      ),
  };
}

export function CheckoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    details,
    setDetails,
  ] =
    useState<CheckoutDetails>({
      ...emptyCheckoutDetails,
    });

  const [
    isCheckoutReady,
    setIsCheckoutReady,
  ] = useState(false);

  useEffect(() => {
    try {
      const stored =
        window.sessionStorage.getItem(
          STORAGE_KEY
        );

      if (stored) {
        const parsed: unknown =
          JSON.parse(stored);

        setDetails(
          sanitizeCheckoutDetails(
            parsed
          )
        );
      }
    } catch (error) {
      console.error(
        "Unable to load checkout details:",
        error
      );

      window.sessionStorage.removeItem(
        STORAGE_KEY
      );
    } finally {
      setIsCheckoutReady(
        true
      );
    }
  }, []);

  const saveDetails =
    useCallback(
      (
        nextDetails: CheckoutDetails
      ) => {
        const sanitized =
          sanitizeCheckoutDetails(
            nextDetails
          );

        setDetails(
          sanitized
        );

        try {
          window.sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
              sanitized
            )
          );
        } catch (error) {
          console.error(
            "Unable to save checkout details:",
            error
          );
        }
      },
      []
    );

  const clearCheckout =
    useCallback(() => {
      setDetails({
        ...emptyCheckoutDetails,
      });

      try {
        window.sessionStorage.removeItem(
          STORAGE_KEY
        );
      } catch (error) {
        console.error(
          "Unable to clear checkout details:",
          error
        );
      }
    }, []);

  const value =
    useMemo(
      () => ({
        details,
        isCheckoutReady,
        saveDetails,
        clearCheckout,
      }),
      [
        details,
        isCheckoutReady,
        saveDetails,
        clearCheckout,
      ]
    );

  return (
    <CheckoutContext.Provider
      value={value}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context =
    useContext(
      CheckoutContext
    );

  if (!context) {
    throw new Error(
      "useCheckout must be used inside CheckoutProvider"
    );
  }

  return context;
}