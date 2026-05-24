export const transactions = [
  {
    id: 1,
    amount: 15000,
    transactionType: "EXPENSE" as const,
    description: "Makan siang",
    note: "Di warteg",
    category: "Makanan",
    createdAt: "2026-05-24T21:54:56.218844",
  },
  {
    id: 2,
    amount: 15000,
    transactionType: "EXPENSE" as const,
    description: "Makan malam",
    note: "Di jerman",
    category: "Makanan",
    createdAt: "2026-05-24T21:55:14.478541",
  },
  {
    id: 3,
    amount: 10000,
    transactionType: "INCOME" as const,
    description: "Hadiah",
    note: "Di jerman",
    category: "Makanan",
    createdAt: "2026-05-24T21:55:32.262863",
  },
];

export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "history", label: "History", icon: "time" },
  { id: "mutations", label: "Mutations", icon: "swap-horizontal" },
  { id: "settings", label: "Settings", icon: "settings-outline" },
];
