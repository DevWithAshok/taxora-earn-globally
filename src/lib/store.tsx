import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Transaction = {
  id: string;
  amount: number;
  currency: string;
  source: string;
  category: "Freelance" | "Royalty" | "Platform";
  date: string;
};

export type Invoice = {
  id: string;
  client: string;
  amount: number;
  currency: string;
  date: string;
};

export type User = { name: string; email: string; country: string } | null;

type Store = {
  user: User;
  transactions: Transaction[];
  invoices: Invoice[];
  login: (u: NonNullable<User>) => void;
  logout: () => void;
  addTransaction: (t: Omit<Transaction, "id" | "category">) => void;
  addInvoice: (i: Omit<Invoice, "id">) => void;
};

const StoreCtx = createContext<Store | null>(null);

const seedTx: Transaction[] = [
  { id: "1", amount: 1200, currency: "USD", source: "Upwork", category: "Freelance", date: "2026-04-12" },
  { id: "2", amount: 480, currency: "USD", source: "YouTube", category: "Platform", date: "2026-04-20" },
  { id: "3", amount: 2150, currency: "EUR", source: "Direct Client", category: "Freelance", date: "2026-04-28" },
  { id: "4", amount: 95, currency: "USD", source: "Gumroad", category: "Royalty", date: "2026-05-01" },
];

function classify(source: string): Transaction["category"] {
  const s = source.toLowerCase();
  if (/(youtube|spotify|tiktok|instagram|twitch)/.test(s)) return "Platform";
  if (/(gumroad|royalty|amazon|kdp|stock)/.test(s)) return "Royalty";
  return "Freelance";
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [transactions, setTx] = useState<Transaction[]>(seedTx);
  const [invoices, setInv] = useState<Invoice[]>([]);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    const u = localStorage.getItem("taxora-user");
    if (u) setUser(JSON.parse(u));
  }, []);

  return (
    <StoreCtx.Provider
      value={{
        user,
        transactions,
        invoices,
        login: (u) => {
          setUser(u);
          localStorage.setItem("taxora-user", JSON.stringify(u));
        },
        logout: () => {
          setUser(null);
          localStorage.removeItem("taxora-user");
        },
        addTransaction: (t) =>
          setTx((arr) => [{ ...t, id: crypto.randomUUID(), category: classify(t.source) }, ...arr]),
        addInvoice: (i) => setInv((arr) => [{ ...i, id: crypto.randomUUID() }, ...arr]),
      }}
    >
      {children}
    </StoreCtx.Provider>
  );
}

export const useStore = () => {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("StoreProvider missing");
  return c;
};

// Simple FX to USD for unified totals
const FX: Record<string, number> = { USD: 1, EUR: 1.08, GBP: 1.27, INR: 0.012, IDR: 0.000063, PHP: 0.018, VND: 0.00004, THB: 0.028, SGD: 0.74 };
export const toUSD = (amount: number, currency: string) => amount * (FX[currency] ?? 1);
