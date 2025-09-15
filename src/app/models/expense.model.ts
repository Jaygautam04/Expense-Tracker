export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: Date;
  category: 'Food' | 'Travel' | 'Bills' | 'Others';
}

export interface ExpenseSummary {
  total: number;
  categoryBreakdown: { [category: string]: number };
}