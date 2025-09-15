import { Injectable, signal } from '@angular/core';
import { Expense, ExpenseSummary } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly STORAGE_KEY = 'expenses';
  
  expenses = signal<Expense[]>([]);

  constructor() {
    this.loadExpenses();
  }

  private loadExpenses(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const expenses = JSON.parse(stored).map((exp: any) => ({
        ...exp,
        date: new Date(exp.date)
      }));
      this.expenses.set(expenses);
    }
  }

  private saveExpenses(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.expenses()));
  }

  addExpense(expense: Omit<Expense, 'id'>): void {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString()
    };
    this.expenses.update(current => [...current, newExpense]);
    this.saveExpenses();
  }

  updateExpense(id: string, expense: Partial<Expense>): void {
    this.expenses.update(current => 
      current.map(exp => exp.id === id ? { ...exp, ...expense } : exp)
    );
    this.saveExpenses();
  }

  deleteExpense(id: string): void {
    this.expenses.update(current => current.filter(exp => exp.id !== id));
    this.saveExpenses();
  }

  getSummary(): ExpenseSummary {
    const expenses = this.expenses();
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryBreakdown = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as { [category: string]: number });

    return { total, categoryBreakdown };
  }
}