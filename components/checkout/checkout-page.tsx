"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";

import Button from "@/components/ui/button";
import { useCart } from "@/components/store/cart-context";
import { useAuth } from "@/components/store/auth-context";
import AuthPanel from "@/components/order/auth-panel";

export default function CheckoutPage() {
  const { items, subtotal, totalItems } = useCart();
  const { user, isReady } = useAuth();
  const router = useRouter();

  function continueToPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/checkout/payment");
  }

  if (!isReady) return <div className="min-h-[70vh] bg-[var(--brand-background)]" />;

  if (!user) {
    return (
      <section className="min-h-[calc(100dvh-80px)] bg-[var(--brand-background)] px-4 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto max-w-[1120px]">
          <div className="mx-auto mb-5 max-w-[560px] text-center"><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]">Step 1 of 3 · Account</p></div>
          <AuthPanel checkout />
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] bg-[var(--brand-background)] px-5 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <ShoppingBag className="text-[var(--brand-primary)]" size={40} strokeWidth={1.4} />
          <h1 className="mt-5 font-serif text-4xl text-[var(--brand-text-dark)]">Nothing to check out yet.</h1>
          <p className="mt-3 text-sm text-[var(--brand-muted)]">Add a cheesecake to your cart first.</p>
          <Button href="/#cheesecakes" size="lg" className="mt-7">Browse Cheesecakes</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--brand-background)] px-4 pb-32 pt-7 sm:px-8 lg:px-12 lg:pb-20 lg:pt-10">
      <div className="mx-auto max-w-[1120px]">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-[var(--brand-muted)] transition hover:text-[var(--brand-primary)]">
          <ArrowLeft size={16} /> Back to cart
        </Link>
        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]">Step 2 of 3 · Delivery</p>
          <h1 className="mt-2 font-serif text-3xl text-[var(--brand-text-dark)] sm:text-4xl">Where should we deliver?</h1>
          <p className="mt-2 text-sm text-[var(--brand-muted)]">Signed in as {user.email}</p>
        </div>

        <form onSubmit={continueToPayment} className="mt-7 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <div>
            <section className="rounded-[24px] border border-[var(--brand-border)] bg-white p-5 shadow-[0_12px_36px_rgba(50,23,22,0.04)] sm:p-7">
              <div className="flex items-center justify-between gap-4"><h2 className="font-serif text-2xl text-[var(--brand-text-dark)]">Contact</h2><span className="text-xs text-[var(--brand-muted)]">Required fields</span></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" name="name" autoComplete="name" defaultValue={user.name} />
                <Field label="Mobile number" name="phone" type="tel" autoComplete="tel" />
                <div className="sm:col-span-2"><Field label="Email address" name="email" type="email" autoComplete="email" defaultValue={user.email} /></div>
              </div>

              <div className="my-7 border-t border-[var(--brand-border)]" />
              <h2 className="font-serif text-2xl text-[var(--brand-text-dark)]">Delivery address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><Field label="Address" name="address" autoComplete="street-address" /></div>
                <Field label="Area" name="area" />
                <Field label="City" name="city" defaultValue="Dubai" />
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--brand-text-dark)]">Delivery notes (optional)
                    <textarea name="notes" rows={3} className="mt-2 w-full resize-none rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-primary)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/20" placeholder="Building, villa or preferred delivery time" />
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end"><Button type="submit" size="md" iconRight={<ArrowRight size={15} />} className="min-h-11 px-6">Continue to payment</Button></div>
            </section>
          </div>

          <aside className="rounded-[24px] border border-[var(--brand-border)] bg-white p-5 lg:sticky lg:top-[112px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">Order summary · {totalItems} {totalItems === 1 ? "item" : "items"}</p>
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
            <p className="mt-5 text-center text-[10px] leading-5 text-[var(--brand-muted)]">Your cart stays saved while you continue to payment.</p>
          </aside>
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return <label className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-text-dark)]">{label}<input {...props} required name={name} type={type} className="mt-2 min-h-11 w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-background)] px-3.5 text-base font-normal normal-case tracking-normal outline-none transition focus:border-[var(--brand-primary)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/20" /></label>;
}
