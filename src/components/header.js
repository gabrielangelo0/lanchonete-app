"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cartCount, useStore } from "./store-context";

const LINKS = [
  { href: "/", label: "Cardápio", emoji: "📖" },
  { href: "/carrinho", label: "Carrinho", emoji: "🛒" },
  { href: "/pedidos", label: "Pedidos", emoji: "🔔" },
];

export default function Header() {
  const { cart, orders, hydrated } = useStore();
  const pathname = usePathname();
  const count = cartCount(cart);
  const activeOrders = orders.filter((order) => order.status !== "entregue").length;

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/90 text-white shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-brand-500 to-red-600 text-2xl shadow-md transition-transform group-hover:scale-105 group-hover:-rotate-6">
            🍔
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight">
              Brasa<span className="text-amber-400">&amp;</span>Banana
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
              burgers · pizza · açaí
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 rounded-full bg-white/5 p-1 text-sm font-medium ring-1 ring-white/10">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            const badge =
              link.href === "/carrinho" ? count : link.href === "/pedidos" ? activeOrders : 0;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-3.5 py-1.5 transition-colors ${
                  active
                    ? "bg-gradient-to-r from-brand-500 to-red-600 text-white shadow"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="sm:hidden">{link.emoji}</span>
                <span className="hidden sm:inline">{link.label}</span>
                {hydrated && badge > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[11px] font-extrabold text-zinc-950 shadow">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
