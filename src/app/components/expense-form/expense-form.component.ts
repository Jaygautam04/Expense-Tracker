import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          <mat-icon>add_circle</mat-icon>
          Add New Expense
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter expense title">
              <mat-error *ngIf="expenseForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Amount</mat-label>
              <input matInput type="number" formControlName="amount" placeholder="0.00">
              <span matTextPrefix>$</span>
              <mat-error *ngIf="expenseForm.get('amount')?.hasError('required')">
                Amount is required
              </mat-error>
              <mat-error *ngIf="expenseForm.get('amount')?.hasError('min')">
                Amount must be greater than 0
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Category</mat-label>
              <mat-select formControlName="category">
                <mat-option value="Food">🍕 Food</mat-option>
                <mat-option value="Travel">✈️ Travel</mat-option>
                <mat-option value="Bills">💡 Bills</mat-option>
                <mat-option value="Others">📦 Others</mat-option>
              </mat-select>
              <mat-error *ngIf="expenseForm.get('category')?.hasError('required')">
                Category is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="expenseForm.get('date')?.hasError('required')">
                Date is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="expenseForm.invalid">
              <mat-icon>save</mat-icon>
              Add Expense
            </button>
            <button mat-button type="button" (click)="resetForm()" class="mr-2">
              <mat-icon>refresh</mat-icon>
              Reset
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    .full-width {
      width: 100%;
    }
    .half-width {
      width: calc(50% - 8px);
    }
    .form-actions {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-top: 20px;
    }
    mat-card {
      margin-bottom: 24px;
    }
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class ExpenseFormComponent {
  private fb = inject(FormBuilder);
  private expenseService = inject(ExpenseService);

  expenseForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    category: ['Food', [Validators.required]],
    date: [new Date(), [Validators.required]]
  });

  onSubmit(): void {
    if (this.expenseForm.valid) {
      this.expenseService.addExpense(this.expenseForm.value);
      this.resetForm();
    }
  }

  resetForm(): void {
    this.expenseForm.reset({
      title: '',
      amount: 0,
      category: 'Food',
      date: new Date()
    });
  }
}