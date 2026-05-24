export type TransactionType = "INCOME" | "EXPENSE";

export interface Transaction {
  id: number;
  amount: number;
  transactionType: TransactionType;
  description: string;
  note: string;
  category: string;
  createdAt: string;
}

export interface TransactionSummary {
  spending: number;
  saving: number;
}

export const isSameMonth = (dateValue: string, referenceDate = new Date()) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth()
  );
};

export const getCurrentMonthTransactions = (
  transactions: Transaction[],
  referenceDate = new Date()
) =>
  transactions.filter((transaction) =>
    isSameMonth(transaction.createdAt, referenceDate)
  );

export const getTransactionSummary = (
  transactions: Transaction[]
): TransactionSummary =>
  transactions.reduce<TransactionSummary>(
    (summary, transaction) => {
      if (transaction.transactionType === "EXPENSE") {
        return {
          ...summary,
          spending: summary.spending + transaction.amount,
        };
      }

      if (transaction.transactionType === "INCOME") {
        return {
          ...summary,
          saving: summary.saving + transaction.amount,
        };
      }

      return summary;
    },
    { spending: 0, saving: 0 }
  );
