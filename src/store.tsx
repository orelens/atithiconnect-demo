import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  type Dish,
  type Lang,
  type Order,
  type Ticket,
  type TicketStatus,
  type OrderStatus,
  dishes,
  initialOrders,
  initialTickets,
} from "./data";

type Cart = Record<string, number>;

type Store = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, hi: string) => string;
  tickets: Ticket[];
  orders: Order[];
  cart: Cart;
  toast: string | null;
  flash: (msg: string) => void;
  addRequest: (t: Omit<Ticket, "id" | "agoMin" | "status">) => void;
  setTicketStatus: (id: string, status: TicketStatus) => void;
  addToCart: (id: string, delta?: number) => void;
  setCartQty: (id: string, qty: number) => void;
  cartItems: { dish: Dish; qty: number }[];
  cartTotal: number;
  placeOrder: (note?: string) => number | null;
  setOrderStatus: (id: number, status: OrderStatus) => void;
  nextOrderId: number;
};

const Ctx = createContext<Store | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [cart, setCart] = useState<Cart>({});
  const [toast, setToast] = useState<string | null>(null);
  const [seq, setSeq] = useState(1051);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }

  function addRequest(partial: Omit<Ticket, "id" | "agoMin" | "status">) {
    const id = "t" + Date.now();
    setTickets((list) => [{ ...partial, id, agoMin: 0, status: "pending" }, ...list]);
    flash(lang === "hi" ? "अनुरोध टीम तक पहुँच गया" : "The team has your request");
  }

  function setTicketStatus(id: string, status: TicketStatus) {
    setTickets((list) => list.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  function addToCart(id: string, delta = 1) {
    setCart((c) => {
      const n = (c[id] || 0) + delta;
      const next = { ...c };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  }

  function setCartQty(id: string, qty: number) {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const dish = dishes.find((d) => d.id === id);
          return dish ? { dish, qty } : null;
        })
        .filter((x): x is { dish: Dish; qty: number } => !!x),
    [cart]
  );
  const cartTotal = cartItems.reduce((s, i) => s + i.dish.price * i.qty, 0);

  function placeOrder(note?: string) {
    if (!cartItems.length) return null;
    const id = seq;
    setSeq((n) => n + 1);
    const order: Order = {
      id,
      room: "101",
      guest: "Priya Sharma",
      agoMin: 0,
      status: "new",
      note,
      items: cartItems.map(({ dish, qty }) => ({
        name: dish.name,
        nameHi: dish.nameHi,
        qty,
        veg: dish.veg,
      })),
    };
    setOrders((list) => [order, ...list]);
    setCart({});
    flash(lang === "hi" ? `आर्डर #${id} रसोई तक गया` : `Order #${id} is in the kitchen`);
    return id;
  }

  function setOrderStatus(id: number, status: OrderStatus) {
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  const value: Store = {
    lang,
    setLang,
    t: (en, hi) => (lang === "hi" ? hi : en),
    tickets,
    orders,
    cart,
    toast,
    flash,
    addRequest,
    setTicketStatus,
    addToCart,
    setCartQty,
    cartItems,
    cartTotal,
    placeOrder,
    setOrderStatus,
    nextOrderId: seq,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemo outside provider");
  return ctx;
}

export function greeting(lang: Lang) {
  const h = Number(
    new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Calcutta", hour: "numeric", hour12: false }).format(new Date())
  );
  if (lang === "hi") {
    if (h < 12) return "सुप्रभात";
    if (h < 17) return "नमस्कार";
    return "शुभ संध्या";
  }
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function ago(min: number, lang: Lang) {
  if (min < 1) return lang === "hi" ? "अभी" : "just now";
  if (min < 60) return lang === "hi" ? `${min} मि पहले` : `${min} min ago`;
  const h = Math.round(min / 60);
  return lang === "hi" ? `${h} घंटे पहले` : `${h} hr ago`;
}
