"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, MENU, formatPrice } from "@/lib/menu";
import { cartCount, cartTotal, useStore } from "@/components/store-context";
import QtyStepper from "@/components/qty-stepper";

// Gradiente do "prato" de cada categoria, para dar variedade visual aos cards.
const TILE_GRADIENTS = {
  burgers: "from-amber-200 to-orange-300",
  pizzas: "from-red-200 to-rose-300",
  acai: "from-purple-200 to-violet-300",
  porcoes: "from-yellow-200 to-amber-300",
  bebidas: "from-sky-200 to-cyan-300",
  sobremesas: "from-pink-200 to-rose-300",
};

export default function MenuPage() {
  const { cart, hydrated, dispatch } = useStore();
  const [category, setCategory] = useState("todos");
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    const term = search.trim().toLowerCase();
    return MENU.filter((item) => {
      if (category !== "todos" && item.category !== category) return false;
      if (!term) return true;
      return (
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    });
  }, [category, search]);

  const qtyOf = (id) => cart.find((line) => line.item.id === id)?.qty ?? 0;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-orange-950 p-8 text-white shadow-xl sm:p-10">
        <span aria-hidden className="absolute -right-6 -top-8 text-[9rem] opacity-15 select-none">
          🍔
        </span>
        <span aria-hidden className="absolute -bottom-10 right-28 text-[7rem] opacity-10 select-none">
          🍕
        </span>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
          Aberto agora · 18h às 23h
        </p>
        <h1 className="mt-2 max-w-md text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          Bateu a fome? <span className="text-amber-400">A brasa já tá acesa.</span>
        </h1>
        <p className="mt-3 max-w-md text-zinc-300">
          Hambúrguer artesanal, pizza no forno a lenha e açaí cremoso, direto pra sua casa.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-sm font-medium">
          <span className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">⭐ 4,9 (2,3 mil)</span>
          <span className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">🛵 30–40 min</span>
          <span className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">🔥 Forno a lenha</span>
        </div>
      </section>

      <div className="space-y-4">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            🔍
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar no cardápio…"
            className="w-full rounded-2xl border border-zinc-900/10 bg-white py-3 pl-11 pr-4 shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <CategoryButton active={category === "todos"} onClick={() => setCategory("todos")}>
            ✨ Todos
          </CategoryButton>
          {CATEGORIES.map((cat) => (
            <CategoryButton
              key={cat.id}
              active={category === cat.id}
              onClick={() => setCategory(cat.id)}
            >
              {cat.emoji} {cat.label}
            </CategoryButton>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white/60 py-16 text-center">
          <p className="text-4xl">🤔</p>
          <p className="mt-2 font-semibold text-zinc-700">Nada por aqui…</p>
          <p className="text-sm text-zinc-500">Tente buscar por outro nome ou categoria.</p>
        </div>
      ) : (
        <ul className="grid gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="group flex flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-900/5 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-brand-500/20"
            >
              <div className="flex items-start gap-4">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl shadow-inner transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6 ${TILE_GRADIENTS[item.category]}`}
                >
                  {item.emoji}
                </span>
                <div>
                  <h2 className="font-bold tracking-tight">{item.name}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between pt-5">
                <span className="text-lg font-extrabold tracking-tight text-zinc-900">
                  {formatPrice(item.price)}
                </span>
                {hydrated && qtyOf(item.id) > 0 ? (
                  <QtyStepper
                    qty={qtyOf(item.id)}
                    onChange={(qty) => dispatch({ type: "setQty", id: item.id, qty })}
                  />
                ) : (
                  <button
                    onClick={() => dispatch({ type: "add", item })}
                    className="rounded-full bg-gradient-to-r from-brand-500 to-red-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-brand-500/25 transition hover:brightness-110 active:scale-95"
                  >
                    Adicionar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {hydrated && cart.length > 0 && (
        <Link
          href="/carrinho"
          className="fixed bottom-5 left-1/2 z-20 flex w-[min(92%,28rem)] -translate-x-1/2 animate-rise items-center justify-between rounded-2xl bg-zinc-950 px-5 py-3.5 text-white shadow-2xl ring-1 ring-white/10 transition hover:bg-zinc-900"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-xs font-extrabold text-zinc-950">
              {cartCount(cart)}
            </span>
            Ver carrinho
          </span>
          <span className="font-extrabold tracking-tight">
            {formatPrice(cartTotal(cart))} →
          </span>
        </Link>
      )}
    </div>
  );
}

function CategoryButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-zinc-950 text-white shadow-md"
          : "bg-white text-zinc-600 shadow-sm ring-1 ring-zinc-900/10 hover:ring-brand-500/40"
      }`}
    >
      {children}
    </button>
  );
}
