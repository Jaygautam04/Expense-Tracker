import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { SummaryDashboardComponent } from './components/summary-dashboard/summary-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    ExpenseFormComponent,
    ExpenseListComponent,
    SummaryDashboardComponent
  ],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>account_balance_wallet</mat-icon>
      <span class="mr-2">Expense Tracker</span>
      <span class="flex-spacer"></span>
    </mat-toolbar>
    
    <div class="container">
      <app-summary-dashboard></app-summary-dashboard>
      <app-expense-form></app-expense-form>
      <app-expense-list></app-expense-list>
    </div>
  `,
  styles: [`
    .flex-spacer {
      flex: 1 1 auto;
    }
  `]
})
export class AppComponent {
  title = 'expense-tracker';
}