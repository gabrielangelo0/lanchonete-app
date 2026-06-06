"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/menu";
import { ORDER_STATUSES, useStore } from "@/components/store-context";

export default function OrdersPage() {
  const { orders, hydrated, dispatch } = useStore();

  if (!hydrated) {
    return <p className="py-16 text-center text-zinc-500">Carregando pedidos…</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex max-w-sm animate-pop flex-col items-center gap-4 rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-zinc-900/5">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-200 text-4xl">
          🔔
        </span>
        <h1 className="text-xl font-extrabold tracking-tight">Nenhum pedido ainda</h1>
        <p className="text-sm text-zinc-500">
          Seus pedidos aparecem aqui assim que você confirmar o carrinho.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-full bg-gradient-to-r from-brand-500 to-red-600 px-6 py-2.5 font-bold text-white shadow-md shadow-brand-500/25 transition hover:brightness-110"
        >
          Fazer um pedido
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Seus pedidos 🔔</h1>

      <ul className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} dispatch={dispatch} />
        ))}
      </ul>
    </div>
  );
}

function OrderCard({ order, dispatch }) {
  const statusIndex = ORDER_STATUSES.findIndex((s) => s.id === order.status);
  const status = ORDER_STATUSES[statusIndex];
  const delivered = order.status === "entregue";
  const progress = (statusIndex / (ORDER_STATUSES.length - 1)) * 100;
  const time = new Date(order.createdAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li className="animate-pop overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-900/5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-zinc-200 px-6 py-4">
        <div>
          <p className="font-extrabold tracking-tight">
            Pedido #{String(order.number).padStart(3, "0")}
            <span className="ml-2 text-sm font-medium text-zinc-400">às {time}</span>
          </p>
          <p className="text-sm text-zinc-500">
            {order.customer.name} ·{" "}
            {order.customer.delivery === "entrega" ? "🛵 Entrega" : "🏃 Retirada"}
          </p>
        </div>
        <span
          className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${
            delivered
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {status.emoji} {status.label}
        </span>
      </div>

      <div className="px-6 py-4">
        {/* Linha do tempo do status */}
        <div className="relative mb-1 h-1.5 rounded-full bg-zinc-100">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 to-green-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ol className="mb-4 flex justify-between text-[11px] font-semibold uppercase tracking-wide">
          {ORDER_STATUSES.map((s, i) => (
            <li key={s.id} className={i <= statusIndex ? "text-zinc-900" : "text-zinc-300"}>
              {s.label}
            </li>
          ))}
        </ol>

        <ul className="space-y-1.5 text-sm">
          {order.items.map((line) => (
            <li key={line.item.id} className="flex justify-between gap-3">
              <span>
                <span className="font-bold text-zinc-700">{line.qty}×</span>{" "}
                {line.item.emoji} {line.item.name}
                {line.notes && (
                  <span className="block pl-7 text-xs italic text-zinc-400">
                    “{line.notes}”
                  </span>
                )}
              </span>
              <span className="shrink-0 text-zinc-500">
                {formatPrice(line.item.price * line.qty)}
              </span>
            </li>
          ))}
          {order.customer.fee > 0 && (
            <li className="flex justify-between gap-3 text-zinc-500">
              <span>🛵 Taxa de entrega</span>
              <span>{formatPrice(order.customer.fee)}</span>
            </li>
          )}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-zinc-200 pt-4">
          <span className="font-extrabold tracking-tight">
            Total {formatPrice(order.total)}
          </span>
          <div className="flex gap-2">
            {order.status === "recebido" && (
              <button
                onClick={() => dispatch({ type: "cancelOrder", id: order.id })}
                className="rounded-full px-4 py-2 text-sm font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
              >
                Cancelar
              </button>
            )}
            {!delivered && (
              <button
                onClick={() => dispatch({ type: "advanceStatus", id: order.id })}
                className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-zinc-800 active:scale-95"
              >
                Avançar status →
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
