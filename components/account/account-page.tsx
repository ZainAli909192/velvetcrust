"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, LogOut, PackageCheck, ShoppingBag, UserRound } from "lucide-react";

import AuthPanel from "@/components/order/auth-panel";
import { useAuth } from "@/components/store/auth-context";
import { useCart } from "@/components/store/cart-context";
import Button from "@/components/ui/button";

export default function AccountPage({ next }: { next?: string }) {
  const router = useRouter();
  const { user, orders, signOut, isReady } = useAuth();
  const { totalItems } = useCart();

  if (!isReady) return <div className="min-h-[70vh] bg-[var(--brand-background)]" />;

  if (!user) {
    return (
      <section className="min-h-[calc(100dvh-80px)] bg-[var(--brand-background)] px-4 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto max-w-[1120px]">
          {next && <div className="mx-auto mb-5 max-w-[560px] rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-primary-soft)]/40 px-4 py-3 text-center text-sm text-[var(--brand-text)]">Sign in to continue securely to checkout.</div>}
          <AuthPanel checkout={Boolean(next)} onSuccess={() => router.push(next ?? "/account")} />
        </div>
      </section>
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const recent = orders[0];

  return (
    <section className="min-h-screen bg-[var(--brand-background)] px-4 pb-32 pt-9 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-primary)]">My account</p><h1 className="mt-2 font-serif text-4xl text-[var(--brand-text-dark)] sm:text-5xl">Welcome, {user.name}.</h1><p className="mt-2 text-sm text-[var(--brand-muted)]">Manage your orders and continue where you left off.</p></div>
          <button type="button" onClick={signOut} className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-[var(--brand-border)] px-4 text-sm text-[var(--brand-muted)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"><LogOut size={16} /> Sign out</button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Metric icon={<PackageCheck size={20} />} label="Total orders" value={String(orders.length)} />
          <Metric icon={<Clock3 size={20} />} label="Recent order" value={recent ? recent.id : "None yet"} />
          <Metric icon={<ShoppingBag size={20} />} label="Cart items" value={String(totalItems)} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_330px]">
          <section className="rounded-[28px] border border-[var(--brand-border)] bg-white p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">Order history</p><h2 className="mt-1 font-serif text-2xl text-[var(--brand-text-dark)]">Recent orders</h2></div>{orders.length > 0 && <span className="text-sm font-semibold text-[var(--brand-primary)]">AED {totalSpent.toFixed(2)} total</span>}</div>
            {recent ? (
              <div className="mt-6 flex flex-col gap-4 rounded-[20px] border border-[var(--brand-border)] bg-[var(--brand-background)] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div><div className="flex items-center gap-2"><span className="font-semibold text-[var(--brand-text-dark)]">{recent.id}</span><span className="rounded-full bg-[var(--brand-primary-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-primary)]">{recent.status}</span></div><p className="mt-2 text-sm text-[var(--brand-muted)]">{new Intl.DateTimeFormat("en-AE", { dateStyle: "medium" }).format(new Date(recent.date))} · {recent.itemCount} {recent.itemCount === 1 ? "item" : "items"}</p></div>
                <p className="text-lg font-bold tabular-nums text-[var(--brand-primary)]">AED {recent.total.toFixed(2)}</p>
              </div>
            ) : (
              <div className="mt-6 rounded-[20px] border border-dashed border-[var(--brand-border)] px-5 py-10 text-center"><ShoppingBag className="mx-auto text-[var(--brand-primary)]" size={28} /><p className="mt-3 font-serif text-xl text-[var(--brand-text-dark)]">No orders yet</p><p className="mt-1 text-sm text-[var(--brand-muted)]">Your latest order will appear here.</p><Button href="/#cheesecakes" size="sm" className="mt-5">Shop cheesecakes</Button></div>
            )}
          </section>

          <aside className="rounded-[28px] border border-[var(--brand-border)] bg-white p-5 sm:p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">Quick actions</p><div className="mt-4 space-y-2"><Action href="/#cheesecakes" icon={<ShoppingBag size={18} />} label="Start a new order" /><Action href="/cart" icon={<PackageCheck size={18} />} label={`View cart (${totalItems})`} /><div className="mt-4 border-t border-[var(--brand-border)] pt-4"><div className="flex items-start gap-3"><UserRound size={18} className="mt-0.5 text-[var(--brand-primary)]" /><div><p className="text-sm font-semibold text-[var(--brand-text-dark)]">Account details</p><p className="mt-1 break-all text-xs leading-5 text-[var(--brand-muted)]">{user.email}</p></div></div></div></div></aside>
        </div>
      </div>
    </section>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-[22px] border border-[var(--brand-border)] bg-white p-5"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">{icon}</div><p className="mt-4 text-xs font-medium text-[var(--brand-muted)]">{label}</p><p className="mt-1 font-serif text-2xl text-[var(--brand-text-dark)]">{value}</p></div>; }
function Action({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) { return <Link href={href} className="flex min-h-12 items-center gap-3 rounded-2xl px-3 text-sm font-semibold text-[var(--brand-text-dark)] transition hover:bg-[var(--brand-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"><span className="text-[var(--brand-primary)]">{icon}</span><span className="flex-1">{label}</span><ArrowRight size={15} className="text-[var(--brand-muted)]" /></Link>; }
