"use client";

import {
  useState,
} from "react";

import {
  CreditCard,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

import {
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import type {
  StripeExpressCheckoutElementConfirmEvent,
} from "@stripe/stripe-js";

import Button from "@/components/ui/button";

type StripePaymentMethod =
  | "card"
  | "apple_pay"
  | "google_pay";

export default function StripePaymentForm({
  method,
  clientSecret,
  orderNumber,
  onSuccess,
}: {
  method:
    StripePaymentMethod;

  clientSecret:
    string;

  orderNumber:
    string;

  onSuccess:
    () => void;
}) {
  const stripe =
    useStripe();

  const elements =
    useElements();

  const [
    isSubmitting,
    setIsSubmitting,
  ] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  const [
    walletAvailable,
    setWalletAvailable,
  ] =
    useState<
      boolean | null
    >(null);

  async function confirmCardPayment() {
    if (
      !stripe ||
      !elements ||
      isSubmitting
    ) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(
      true
    );

    try {
      const {
        error,
      } =
        await stripe.confirmPayment({
          elements,

          confirmParams: {
            return_url:
              `${window.location.origin}/checkout/payment`,
          },

          redirect:
            "if_required",
        });

      if (error) {
        setErrorMessage(
          error.message ||
            "Payment could not be completed."
        );

        return;
      }

      const {
        paymentIntent,
        error:
          retrieveError,
      } =
        await stripe.retrievePaymentIntent(
          clientSecret
        );

      if (
        retrieveError
      ) {
        setErrorMessage(
          retrieveError.message ||
            "Unable to verify payment status."
        );

        return;
      }

      if (
        paymentIntent?.status ===
          "succeeded"
      ) {
        onSuccess();

        return;
      }

      if (
        paymentIntent?.status ===
          "processing"
      ) {
        setErrorMessage(
          "Your payment is processing. Please wait for confirmation."
        );

        return;
      }

      if (
        paymentIntent?.status ===
          "requires_payment_method"
      ) {
        setErrorMessage(
          "Payment was not completed. Please check your payment details and try again."
        );

        return;
      }

      setErrorMessage(
        "Payment has not been completed yet. Please try again."
      );
    } catch {
      setErrorMessage(
        "Unable to complete payment. Please try again."
      );
    } finally {
      setIsSubmitting(
        false
      );
    }
  }

  async function handleWalletConfirm(
    event:
      StripeExpressCheckoutElementConfirmEvent
  ) {
    if (
      !stripe ||
      !elements ||
      isSubmitting
    ) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(
      true
    );

    try {
      const {
        error,
      } =
        await stripe.confirmPayment({
          elements,

          confirmParams: {
            return_url:
              `${window.location.origin}/checkout/payment`,
          },

          redirect:
            "if_required",
        });

      if (error) {
        event.paymentFailed({
          reason:
            "fail",
        });

        setErrorMessage(
          error.message ||
            "Payment could not be completed."
        );

        return;
      }

      const {
        paymentIntent,
        error:
          retrieveError,
      } =
        await stripe.retrievePaymentIntent(
          clientSecret
        );

      if (
        retrieveError
      ) {
        event.paymentFailed({
          reason:
            "fail",
        });

        setErrorMessage(
          retrieveError.message ||
            "Unable to verify payment status."
        );

        return;
      }

      if (
        paymentIntent?.status ===
          "succeeded"
      ) {
        onSuccess();

        return;
      }

      if (
        paymentIntent?.status ===
          "processing"
      ) {
        setErrorMessage(
          "Your payment is processing. Please wait for confirmation."
        );

        return;
      }

      event.paymentFailed({
        reason:
          "fail",
      });

      setErrorMessage(
        "Payment was not completed. Please try again."
      );
    } catch {
      event.paymentFailed({
        reason:
          "fail",
      });

      setErrorMessage(
        "Unable to complete payment. Please try again."
      );
    } finally {
      setIsSubmitting(
        false
      );
    }
  }

  if (
    method === "card"
  ) {
    return (
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
            <CreditCard
              size={20}
            />
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[var(--brand-text-dark)]">
              Card payment
            </h2>

            <p className="mt-1 text-xs text-[var(--brand-muted)]">
              Order{" "}
              {orderNumber}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <PaymentElement
            options={{
              layout:
                "tabs",
            }}
          />
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        <Button
          type="button"
          size="lg"
          fullWidth
          disabled={
            !stripe ||
            !elements ||
            isSubmitting
          }
          onClick={
            confirmCardPayment
          }
          iconLeft={
            isSubmitting ? (
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            ) : (
              <LockKeyhole
                size={15}
              />
            )
          }
          className="mt-6"
        >
          {isSubmitting
            ? "Processing payment..."
            : "Pay securely"}
        </Button>

        <p className="mt-4 text-center text-[11px] leading-5 text-[var(--brand-muted)]">
          Your card details are securely handled by Stripe.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2 className="font-serif text-2xl text-[var(--brand-text-dark)]">
          {method ===
          "apple_pay"
            ? "Apple Pay"
            : "Google Pay"}
        </h2>

        <p className="mt-1 text-xs text-[var(--brand-muted)]">
          Order{" "}
          {orderNumber}
        </p>
      </div>

      <div className="mt-6">
        <ExpressCheckoutElement
          options={{
            buttonType: {
              applePay:
                "plain",

              googlePay:
                "plain",
            },

            paymentMethods: {
              applePay:
                method ===
                "apple_pay"
                  ? "always"
                  : "never",

              googlePay:
                method ===
                "google_pay"
                  ? "always"
                  : "never",
            },
          }}
          onReady={(
            event
          ) => {
            const available =
              event.availablePaymentMethods;

            if (
              method ===
              "apple_pay"
            ) {
              setWalletAvailable(
                Boolean(
                  available?.applePay
                )
              );

              return;
            }

            setWalletAvailable(
              Boolean(
                available?.googlePay
              )
            );
          }}
          onConfirm={
            handleWalletConfirm
          }
        />
      </div>

      {walletAvailable ===
        null && (
        <div className="mt-5 flex items-center gap-2 text-sm text-[var(--brand-muted)]">
          <LoaderCircle
            size={15}
            className="animate-spin"
          />

          Checking wallet availability...
        </div>
      )}

      {walletAvailable ===
        false && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
          {method ===
          "apple_pay"
            ? "Apple Pay is not available on this device or browser. Please choose another payment method."
            : "Google Pay is not available on this device or browser. Please choose another payment method."}
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {isSubmitting && (
        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-[var(--brand-muted)]">
          <LoaderCircle
            size={16}
            className="animate-spin"
          />

          Processing payment...
        </div>
      )}

      <p className="mt-5 text-center text-[11px] leading-5 text-[var(--brand-muted)]">
        Wallet availability is securely determined by Stripe and your device.
      </p>
    </div>
  );
}