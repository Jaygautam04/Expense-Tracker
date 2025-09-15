import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';
import { EditExpenseDialogComponent } from '../edit-expense-dialog/edit-expense-dialog.component';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          <mat-icon>receipt_long</mat-icon>
          Expense List ({{expenses().length}})
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="expenses-container">
          <div *ngIf="expenses().length === 0" class="no-expenses">
            <mat-icon>inbox</mat-icon>
            <p>No expenses found. Add your first expense above!</p>
          </div>

          <!-- Mobile Card View -->
          <div class="mobile-view">
            <mat-card *ngFor="let expense of expenses()" class="expense-card">
              <mat-card-content>
                <div class="expense-header">
                  <h3>{{expense.title}}</h3>
                  <span class="amount">\${{expense.amount | number:'1.2-2'}}</span>
                </div>
                <div class="expense-details">
                  <mat-chip [color]="getCategoryColor(expense.category)">
                    {{getCategoryIcon(expense.category)}} {{expense.category}}
                  </mat-chip>
                  <span class="date">{{expense.date | date:'shortDate'}}</span>
                </div>
                <div class="expense-actions">
                  <button mat-icon-button color="primary" (click)="editExpense(expense)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteExpense(expense.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Desktop Table View -->
          <div class="desktop-view">
            <table mat-table [dataSource]="expenses()">
              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef>Title</th>
                <td mat-cell *matCellDef="let expense">{{expense.title}}</td>
              </ng-container>

              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Amount</th>
                <td mat-cell *matCellDef="let expense" class="amount-cell">
                  \${{expense.amount | number:'1.2-2'}}
                </td>
              </ng-container>

              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef>Category</th>
                <td mat-cell *matCellDef="let expense">
                  <mat-chip [color]="getCategoryColor(expense.category)">
                    {{getCategoryIcon(expense.category)}} {{expense.category}}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let expense">{{expense.date | date:'shortDate'}}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let expense">
                  <button mat-icon-button color="primary" (click)="editExpense(expense)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteExpense(expense.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .expenses-container {
      margin-top: 16px;
    }
    .no-expenses {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    .no-expenses mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
    .expense-card {
      margin-bottom: 12px;
    }
    .expense-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .expense-header h3 {
      margin: 0;
      font-weight: 500;
    }
    .amount {
      font-size: 18px;
      font-weight: bold;
      color: #e91e63;
    }
    .amount-cell {
      font-weight: bold;
      color: #e91e63;
    }
    .expense-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .date {
      color: #666;
      font-size: 14px;
    }
    .expense-actions {
      display: flex;
      justify-content: flex-end;
    }
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    /* Responsive Design */
    .mobile-view {
      display: block;
    }
    .desktop-view {
      display: none;
    }
    
    @media (min-width: 768px) {
      .mobile-view {
        display: none;
      }
      .desktop-view {
        display: block;
      }
    }
    
    /* Table Styling */
    table {
      width: 100%;
    }
    .mat-mdc-header-cell {
      font-weight: bold;
    }
  `]
})
export class ExpenseListComponent {
  private expenseService = inject(ExpenseService);
  private dialog = inject(MatDialog);
  
  expenses = this.expenseService.expenses;
  displayedColumns: string[] = ['title', 'amount', 'category', 'date', 'actions'];

  editExpense(expense: Expense): void {
    const dialogRef = this.dialog.open(EditExpenseDialogComponent, {
      width: '500px',
      data: { expense }
    });

    dialogRef.afterClosed().subscribe((updatedExpense: Expense) => {
      if (updatedExpense) {
        this.expenseService.updateExpense(expense.id, updatedExpense);
      }
    });
  }

  deleteExpense(id: string): void {
    this.expenseService.deleteExpense(id);
  }

  getCategoryColor(category: string): 'primary' | 'accent' | 'warn' | '' {
    const colors: { [key: string]: 'primary' | 'accent' | 'warn' | '' } = {
      'Food': 'primary',
      'Travel': 'accent',
      'Bills': 'warn',
      'Others': ''
    };
    return colors[category] || '';
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Food': '🍕',
      'Travel': '✈️',
      'Bills': '💡',
      'Others': '📦'
    };
    return icons[category] || '📦';
  }
}