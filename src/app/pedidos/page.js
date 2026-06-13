"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/menu";
import { ORDER_STATUSES, useStore } from "@/components/store-context";

const INITIAL_FORM = {
  photo: "",
  name: "",
  price: "",
  qty: "1",
  customer: "",
  delivery: "retirada",
  fee: "0",
  notes: "",
};

export default function OrdersPage() {
  const { orders, hydrated, dispatch } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [manualForm, setManualForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");

  if (!hydrated) {
    return <p className="py-16 text-center text-zinc-500">Carregando pedidos…</p>;
  }

  function updateField(field, value) {
    setManualForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  }

  function submitManualOrder(event) {
    event.preventDefault();

    const price = Number(manualForm.price);
    const qty = Number(manualForm.qty);
    const fee = Number(manualForm.fee || 0);

    if (!manualForm.photo.trim() || !manualForm.name.trim() || !manualForm.customer.trim()) {
      setFormError("Preencha foto, nome do pedido e nome do cliente.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(qty) || qty <= 0) {
      setFormError("Informe preco e quantidade validos.");
      return;
    }

    if (!Number.isFinite(fee) || fee < 0) {
      setFormError("A taxa de entrega precisa ser zero ou maior.");
      return;
    }

    dispatch({
      type: "createManualOrder",
      id: crypto.randomUUID(),
      customer: {
        name: manualForm.customer.trim(),
        delivery: manualForm.delivery,
        fee,
      },
      items: [
        {
          qty,
          notes: manualForm.notes.trim(),
          item: {
            id: crypto.randomUUID(),
            name: manualForm.name.trim(),
            price,
            photo: manualForm.photo.trim(),
            emoji: "🧾",
          },
        },
      ],
      total: price * qty + fee,
      createdAt: new Date().toISOString(),
    });

    setManualForm(INITIAL_FORM);
    setFormError("");
    setShowForm(false);
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <ManualOrderPanel
          form={manualForm}
          error={formError}
          showForm={showForm}
          onToggle={() => setShowForm((current) => !current)}
          onChange={updateField}
          onSubmit={submitManualOrder}
        />

        <div className="mx-auto flex max-w-sm animate-pop flex-col items-center gap-4 rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-zinc-900/5">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-200 text-4xl">
            🔔
          </span>
          <h1 className="text-xl font-extrabold tracking-tight">Nenhum pedido ainda</h1>
          <p className="text-sm text-zinc-500">
            Seus pedidos aparecem aqui assim que voce confirmar o carrinho ou cadastrar
            um manualmente.
          </p>
          <Link
            href="/"
            className="mt-2 rounded-full bg-gradient-to-r from-brand-500 to-red-600 px-6 py-2.5 font-bold text-white shadow-md shadow-brand-500/25 transition hover:brightness-110"
          >
            Fazer um pedido
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">Seus pedidos 🔔</h1>
        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-800"
        >
          {showForm ? "Fechar cadastro manual" : "Cadastrar pedido manual"}
        </button>
      </div>

      {showForm && (
        <ManualOrderPanel
          form={manualForm}
          error={formError}
          showForm={showForm}
          onToggle={() => setShowForm((current) => !current)}
          onChange={updateField}
          onSubmit={submitManualOrder}
        />
      )}

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
              <span className="flex gap-3">
                {line.item.photo ? (
                  <img
                    src={line.item.photo}
                    alt={line.item.name}
                    className="h-12 w-12 rounded-2xl object-cover ring-1 ring-zinc-900/5"
                  />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                    {line.item.emoji}
                  </span>
                )}
                <span>
                  <span className="font-bold text-zinc-700">{line.qty}×</span>{" "}
                  {line.item.emoji} {line.item.name}
                  {line.notes && (
                    <span className="block text-xs italic text-zinc-400">“{line.notes}”</span>
                  )}
                </span>
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

function ManualOrderPanel({ form, error, showForm, onToggle, onChange, onSubmit }) {
  return (
    <section className="animate-pop rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Cadastro manual
          </p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight">
            Adicionar um novo pedido
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Digite a foto, nome do pedido, preco, quantidade e dados do cliente.
          </p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-500 ring-1 ring-zinc-200 transition hover:bg-zinc-50"
        >
          {showForm ? "Ocultar" : "Abrir formulario"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          <Field
            label="Foto do pedido"
            placeholder="https://..."
            value={form.photo}
            onChange={(value) => onChange("photo", value)}
          />
          <Field
            label="Nome do pedido"
            placeholder="Ex.: X-Bacon especial"
            value={form.name}
            onChange={(value) => onChange("name", value)}
          />
          <Field
            label="Preco unitario"
            type="number"
            min="0"
            step="0.01"
            placeholder="29.90"
            value={form.price}
            onChange={(value) => onChange("price", value)}
          />
          <Field
            label="Quantidade"
            type="number"
            min="1"
            step="1"
            value={form.qty}
            onChange={(value) => onChange("qty", value)}
          />
          <Field
            label="Nome do cliente"
            placeholder="Ex.: Gabriel"
            value={form.customer}
            onChange={(value) => onChange("customer", value)}
          />
          <Field
            label="Taxa de entrega"
            type="number"
            min="0"
            step="0.01"
            value={form.fee}
            onChange={(value) => onChange("fee", value)}
          />

          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-zinc-700">Entrega</span>
            <select
              value={form.delivery}
              onChange={(event) => onChange("delivery", event.target.value)}
              className="w-full rounded-2xl border border-zinc-900/10 bg-zinc-50 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
            >
              <option value="retirada">Retirada</option>
              <option value="entrega">Entrega</option>
            </select>
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm font-semibold text-zinc-700">Observacoes</span>
            <textarea
              rows="3"
              value={form.notes}
              onChange={(event) => onChange("notes", event.target.value)}
              placeholder="Ex.: sem cebola, entregar apos as 20h..."
              className="w-full rounded-2xl border border-zinc-900/10 bg-zinc-50 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
            />
          </label>

          {form.photo && (
            <div className="overflow-hidden rounded-3xl bg-zinc-100 md:col-span-2">
              <img
                src={form.photo}
                alt="Pre-visualizacao do pedido"
                className="h-48 w-full object-cover"
              />
            </div>
          )}

          {error && (
            <p className="text-sm font-medium text-red-600 md:col-span-2">{error}</p>
          )}

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-bold text-white shadow-md shadow-green-600/20 transition hover:brightness-110"
            >
              Salvar pedido manual
            </button>
            <button
              type="button"
              onClick={onToggle}
              className="rounded-full px-6 py-3 font-semibold text-zinc-500 ring-1 ring-zinc-200 transition hover:bg-zinc-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function Field({ label, onChange, ...props }) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-semibold text-zinc-700">{label}</span>
      <input
        {...props}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-zinc-900/10 bg-zinc-50 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
      />
    </label>
  );
}
