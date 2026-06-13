"use client";

import { createContext, useContext, useEffect, useReducer, useState } from "react";

const StoreContext = createContext(null);

export const ORDER_STATUSES = [
  { id: "recebido", label: "Recebido", emoji: "📥" },
  { id: "preparando", label: "Preparando", emoji: "👨‍🍳" },
  { id: "pronto", label: "Pronto", emoji: "🔔" },
  { id: "entregue", label: "Entregue", emoji: "✅" },
];

const STORAGE_KEY = "order-app-store";

const initialState = { cart: [], orders: [] };

function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return action.state;

    case "add": {
      const existing = state.cart.find((line) => line.item.id === action.item.id);
      const cart = existing
        ? state.cart.map((line) =>
            line.item.id === action.item.id ? { ...line, qty: line.qty + 1 } : line
          )
        : [...state.cart, { item: action.item, qty: 1, notes: "" }];
      return { ...state, cart };
    }

    case "setQty": {
      const cart = state.cart
        .map((line) => (line.item.id === action.id ? { ...line, qty: action.qty } : line))
        .filter((line) => line.qty > 0);
      return { ...state, cart };
    }

    case "setNotes": {
      const cart = state.cart.map((line) =>
        line.item.id === action.id ? { ...line, notes: action.notes } : line
      );
      return { ...state, cart };
    }

    case "remove":
      return { ...state, cart: state.cart.filter((line) => line.item.id !== action.id) };

    case "clearCart":
      return { ...state, cart: [] };

    case "placeOrder": {
      const order = {
        id: action.id,
        number: state.orders.length + 1,
        customer: action.customer,
        items: state.cart,
        total: cartTotal(state.cart) + (action.customer.fee || 0),
        status: "recebido",
        createdAt: action.createdAt,
      };
      return { cart: [], orders: [order, ...state.orders] };
    }

    case "createManualOrder": {
      const order = {
        id: action.id,
        number: state.orders.length + 1,
        customer: action.customer,
        items: action.items,
        total: action.total,
        status: "recebido",
        createdAt: action.createdAt,
      };
      return { ...state, orders: [order, ...state.orders] };
    }

    case "advanceStatus": {
      const orders = state.orders.map((order) => {
        if (order.id !== action.id) return order;
        const index = ORDER_STATUSES.findIndex((s) => s.id === order.status);
        const next = ORDER_STATUSES[Math.min(index + 1, ORDER_STATUSES.length - 1)];
        return { ...order, status: next.id };
      });
      return { ...state, orders };
    }

    case "cancelOrder":
      return { ...state, orders: state.orders.filter((order) => order.id !== action.id) };

    default:
      return state;
  }
}

export function cartTotal(cart) {
  return cart.reduce((sum, line) => sum + line.item.price * line.qty, 0);
}

export function cartCount(cart) {
  return cart.reduce((sum, line) => sum + line.qty, 0);
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // Evita mismatch de hidratação: o localStorage só é lido após a montagem.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "hydrate", state: JSON.parse(saved) });
    } catch {
      // Estado corrompido — segue com o estado inicial vazio.
    }
    queueMicrotask(() => {
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  return (
    <StoreContext.Provider value={{ ...state, hydrated, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore deve ser usado dentro de <StoreProvider>");
  return context;
}
