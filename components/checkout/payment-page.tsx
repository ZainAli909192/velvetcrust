"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "@/components/store/cart-context";
import { useAuth } from "@/components/store/auth-context";
import Button from "@/components/ui/button";
import AuthPanel from "@/components/order/auth-panel";

type PaymentMethod = "google-pay" | "card" | "tabby" | "tamara";

const paymentMethods: Array<{
  id: PaymentMethod;
  name: string;
  description: string;
  mark: string;
}> = [
  { id: "google-pay", name: "Google Pay", description: "Fast checkout with your saved Google payment method.", mark: "G Pay" },
  { id: "card", name: "Credit or debit card", description: "Visa, Mastercard and other major cards.", mark: "CARD" },
  { id: "tabby", name: "Tabby", description: "Split your purchase into interest-free payments.", mark: "tabby" },
  { id: "tamara", name: "Tamara", description: "Buy now and split your payment with Tamara.", mark: "tamara" },
];

export default function PaymentPage() {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const { user, isReady, addOrder } = useAuth();
  const [method, setMethod] = useState<PaymentMethod>("google-pay");
  const [completed, setCompleted] = useState(false);

  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addOrder({ total: subtotal, itemCount: totalItems });
    clearCart();
    setCompleted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!isReady) return <div className="min-h-[70vh] bg-[var(--brand-background)]" />;

  if (!user) {
    return <section className="min-h-[calc(100dvh-80px)] bg-[var(--brand-background)] px-4 py-10 sm:px-8 lg:py-14"><AuthPanel checkout /></section>;
  }

  if (completed) {
    return (
      <section className="min-h-[70vh] bg-[var(--brand-background)] px-5 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
            <CheckCircle2 size={36} strokeWidth={1.6} />
          </div>
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--brand-primary)]">Order received</p>
          <h1 className="mt-2 font-serif text-4xl text-[var(--brand-text-dark)] sm:text-5xl">Thank you.</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-[var(--brand-muted)]">Your Velvet Crust order has been placed successfully. We&apos;ll send your confirmation shortly.</p>
          <Button href="/#cheesecakes" size="lg" className="mt-8">Continue shopping</Button>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] bg-[var(--brand-background)] px-5 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <ShoppingBag size={40} strokeWidth={1.4} className="text-[var(--brand-primary)]" />
          <h1 className="mt-5 font-serif text-4xl text-[var(--brand-text-dark)]">Your cart is empty.</h1>
          <p className="mt-3 text-sm text-[var(--brand-muted)]">Add an item before choosing a payment method.</p>
          <Button href="/#cheesecakes" size="lg" className="mt-7">Browse cheesecakes</Button>
        </div>
      </section>
    );
  }

  const selectedName = paymentMethods.find((item) => item.id === method)?.name ?? "payment";

  return (
    <section className="min-h-screen bg-[var(--brand-background)] px-4 pb-32 pt-8 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12">
      <div className="mx-auto max-w-[1300px]">
        <Link href="/checkout" className="inline-flex items-center gap-2 text-sm text-[var(--brand-muted)] transition hover:text-[var(--brand-primary)]">
          <ArrowLeft size={16} /> Back to details
        </Link>
        <div className="mt-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--brand-primary)]">Secure payment</p>
          <h1 className="mt-2 font-serif text-4xl text-[var(--brand-text-dark)] sm:text-5xl">Choose how to pay.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--brand-muted)]">Select a payment option to finish your order.</p>
        </div>

        <form onSubmit={placeOrder} className="mt-10 grid gap-8 lg:grid-cols-[1fr_390px] lg:items-start">
          <div className="rounded-[28px] border border-[var(--brand-border)] bg-white p-5 sm:p-7">
            <h2 className="font-serif text-2xl text-[var(--brand-text-dark)]">Payment method</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {paymentMethods.map((option) => {
                const selected = method === option.id;
                return (
                  <label key={option.id} className={`relative flex cursor-pointer items-start gap-4 rounded-[20px] border p-4 transition ${selected ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)]/40" : "border-[var(--brand-border)] hover:border-[var(--brand-primary-light)]"}`}>
                    <input className="sr-only" type="radio" name="paymentMethod" value={option.id} checked={selected} onChange={() => setMethod(option.id)} />
                    <span className={`flex h-10 min-w-14 items-center justify-center rounded-xl px-2 text-xs font-bold ${option.id === "google-pay" ? "bg-black text-white" : option.id === "tabby" ? "bg-[#3fefc6] text-black" : option.id === "tamara" ? "bg-[#ffcac8] text-black" : "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"}`}>
                      {option.id === "card" ? <CreditCard size={20} /> : option.mark}
                    </span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-[var(--brand-text-dark)]">{option.name}</span><span className="mt-1 block text-xs leading-5 text-[var(--brand-muted)]">{option.description}</span></span>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white" : "border-[var(--brand-border)]"}`}>{selected && <Check size={12} />}</span>
                  </label>
                );
              })}
            </div>

            {method === "card" && (
              <div className="mt-6 rounded-[22px] border border-[var(--brand-border)] bg-[var(--brand-background)] p-4 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2"><CardField label="Cardholder name" name="cardName" autoComplete="cc-name" /></div>
                  <div className="sm:col-span-2"><CardField label="Card number" name="cardNumber" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" /></div>
                  <CardField label="Expiry" name="expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" />
                  <CardField label="Security code" name="cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="CVC" />
                </div>
              </div>
            )}

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[var(--brand-primary-soft)]/40 p-4 text-[var(--brand-muted)]">
              <ShieldCheck className="mt-0.5 shrink-0 text-[var(--brand-primary)]" size={18} />
              <p className="text-xs leading-5">Your payment details are protected. No charge is made until you confirm below.</p>
            </div>

            <Button type="submit" size="lg" fullWidth iconLeft={<LockKeyhole size={15} />} className="mt-6">
              Place order with {selectedName}
            </Button>
          </div>

          <OrderSummary items={items} subtotal={subtotal} totalItems={totalItems} />
        </form>
      </div>
    </section>
  );
}

function CardField({ label, name, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--brand-text-dark)]">
      {label}
      <input {...props} required name={name} className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 text-sm font-normal normal-case tracking-normal outline-none transition focus:border-[var(--brand-primary)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/20" />
    </label>
  );
}

function OrderSummary({ items, subtotal, totalItems }: { items: ReturnType<typeof useCart>["items"]; subtotal: number; totalItems: number }) {
  return (
    <aside className="rounded-[28px] border border-[var(--brand-border)] bg-white p-6 lg:sticky lg:top-[120px]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--brand-primary)]">Order summary · {totalItems} {totalItems === 1 ? "item" : "items"}</p>
      <div className="mt-5 max-h-[330px] space-y-4 overflow-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 border-b border-[var(--brand-border)] pb-4 last:border-0">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[var(--brand-primary-soft)]"><Image src={item.image} alt="" fill className="object-contain p-1" sizes="64px" /></div>
            <div className="min-w-0 flex-1"><p className="truncate font-serif text-base text-[var(--brand-text-dark)]">{item.name}</p><p className="mt-1 text-xs text-[var(--brand-muted)]">Qty {item.quantity}</p></div>
            <p className="text-sm font-semibold text-[var(--brand-text-dark)]">AED {(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-3 border-t border-[var(--brand-border)] pt-5 text-sm">
        <div className="flex justify-between"><span className="text-[var(--brand-muted)]">Subtotal</span><span>AED {subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-[var(--brand-muted)]">Delivery</span><span className="text-[var(--brand-muted)]">Confirmed by phone</span></div>
        <div className="flex justify-between border-t border-[var(--brand-border)] pt-4"><span className="font-serif text-xl">Total</span><span className="text-xl font-bold text-[var(--brand-primary)]">AED {subtotal.toFixed(2)}</span></div>
      </div>
    </aside>
  );
}
