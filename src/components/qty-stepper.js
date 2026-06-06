"use client";

export default function QtyStepper({ qty, onChange }) {
  return (
    <div className="flex items-center gap-0.5 rounded-full bg-zinc-100 p-1 ring-1 ring-zinc-900/5">
      <button
        onClick={() => onChange(qty - 1)}
        aria-label="Diminuir quantidade"
        className="h-7 w-7 rounded-full bg-white text-base font-bold text-zinc-700 shadow-sm transition hover:text-red-600 active:scale-90"
      >
        −
      </button>
      <span className="min-w-7 text-center text-sm font-bold">{qty}</span>
      <button
        onClick={() => onChange(qty + 1)}
        aria-label="Aumentar quantidade"
        className="h-7 w-7 rounded-full bg-white text-base font-bold text-zinc-700 shadow-sm transition hover:text-brand-600 active:scale-90"
      >
        +
      </button>
    </div>
  );
}
