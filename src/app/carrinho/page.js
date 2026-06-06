"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/menu";
import { cartTotal, useStore } from "@/components/store-context";
import QtyStepper from "@/components/qty-stepper";

const DELIVERY_FEE = 7.0;

export default function CartPage() {
  const { cart, hydrated, dispatch } = useStore();
  const router = useRouter();
  const [customer, setCustomer] = useState("");
  const [delivery, setDelivery] = useState("retirada");
  const [error, setError] = useState("");

  if (!hydrated) {
    return <p className="py-16 text-center text-zinc-500">Carregando carrinho…</p>;
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-sm animate-pop flex-col items-center gap-4 rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-zinc-900/5">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-200 text-4xl">
          🛒
        </span>
        <h1 className="text-xl font-extrabold tracking-tight">Seu carrinho está vazio</h1>
        <p className="text-sm text-zinc-500">
          Que tal um hambúrguer na brasa ou um açaí bem cremoso?
        </p>
        <Link
          href="/"
          className="mt-2 rounded-full bg-gradient-to-r from-brand-500 to-red-600 px-6 py-2.5 font-bold text-white shadow-md shadow-brand-500/25 transition hover:brightness-110"
        >
          Ver cardápio
        </Link>
      </div>
    );
  }

  const subtotal = cartTotal(cart);
  const fee = delivery === "entrega" ? DELIVERY_FEE : 0;
  const total = subtotal + fee;

  function placeOrder() {
    if (!customer.trim()) {
      setError("Informe seu nome para identificarmos o pedido.");
      return;
    }
    dispatch({
      type: "placeOrder",
      id: crypto.randomUUID(),
      customer: { name: customer.trim(), delivery, fee },
      createdAt: new Date().toISOString(),
    });
    router.push("/pedidos");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Seu carrinho 🛒</h1>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <ul className="space-y-3">
          {cart.map((line) => (
            <li
              key={line.item.id}
              className="animate-pop rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-900/5"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 p-3 text-2xl">
                  {line.item.emoji}
                </span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-bold tracking-tight">{line.item.name}</h2>
                      <p className="text-sm text-zinc-500">
                        {formatPrice(line.item.price)} cada
                      </p>
                    </div>
                    <button
                      onClick={() => dispatch({ type: "remove", id: line.item.id })}
                      aria-label={`Remover ${line.item.name}`}
                      className="rounded-full px-2 py-1 text-sm font-medium text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <QtyStepper
                      qty={line.qty}
                      onChange={(qty) => dispatch({ type: "setQty", id: line.item.id, qty })}
                    />
                    <span className="font-extrabold tracking-tight">
                      {formatPrice(line.item.price * line.qty)}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={line.notes}
                    onChange={(e) =>
                      dispatch({ type: "setNotes", id: line.item.id, notes: e.target.value })
                    }
                    placeholder="Observações (ex.: sem cebola, açaí com nutella…)"
                    className="mt-3 w-full rounded-xl border border-zinc-900/10 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                  />
                </div>
              </div>
            </li>
          ))}

          <li>
            <button
              onClick={() => dispatch({ type: "clearCart" })}
              className="text-sm font-medium text-zinc-400 transition hover:text-red-600"
            >
              Esvaziar carrinho
            </button>
          </li>
        </ul>

        <section className="space-y-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 lg:sticky lg:top-24">
          <h2 className="text-lg font-extrabold tracking-tight">Finalizar pedido</h2>

          <div className="space-y-1.5">
            <label htmlFor="customer" className="text-sm font-semibold text-zinc-700">
              Seu nome
            </label>
            <input
              id="customer"
              type="text"
              value={customer}
              onChange={(e) => {
                setCustomer(e.target.value);
                setError("");
              }}
              placeholder="Ex.: Gabriel"
              className="w-full rounded-xl border border-zinc-900/10 bg-zinc-50 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
            />
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-zinc-700">
              Como prefere receber?
            </legend>
            <div className="flex gap-2">
              <DeliveryOption
                checked={delivery === "retirada"}
                onChange={() => setDelivery("retirada")}
                title="🏃 Retirada"
                subtitle="Grátis"
              />
              <DeliveryOption
                checked={delivery === "entrega"}
                onChange={() => setDelivery("entrega")}
                title="🛵 Entrega"
                subtitle={formatPrice(DELIVERY_FEE)}
              />
            </div>
          </fieldset>

          <dl className="space-y-1.5 border-t border-dashed border-zinc-200 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Subtotal</dt>
              <dd className="font-medium">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Taxa de entrega</dt>
              <dd className="font-medium">
                {fee > 0 ? formatPrice(fee) : <span className="text-green-600">Grátis</span>}
              </dd>
            </div>
            <div className="flex justify-between pt-1 text-base font-extrabold tracking-tight">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          <button
            onClick={placeOrder}
            className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 py-3.5 font-extrabold text-white shadow-md shadow-green-600/25 transition hover:brightness-110 active:scale-[0.99]"
          >
            Confirmar pedido · {formatPrice(total)}
          </button>
        </section>
      </div>
    </div>
  );
}

function DeliveryOption({ checked, onChange, title, subtitle }) {
  return (
    <label
      className={`flex flex-1 cursor-pointer flex-col rounded-2xl px-4 py-3 transition ${
        checked
          ? "bg-brand-50 ring-2 ring-brand-500"
          : "ring-1 ring-zinc-900/10 hover:ring-brand-500/40"
      }`}
    >
      <input
        type="radio"
        name="delivery"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="font-bold tracking-tight">{title}</span>
      <span className="text-sm text-zinc-500">{subtitle}</span>
    </label>
  );
}
