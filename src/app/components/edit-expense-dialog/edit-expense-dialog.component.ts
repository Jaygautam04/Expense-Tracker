import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-edit-expense-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>edit</mat-icon>
      Edit Expense
    </h2>
    
    <mat-dialog-content>
      <form [formGroup]="expenseForm">
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
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        <mat-icon>cancel</mat-icon>
        Cancel
      </button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="expenseForm.invalid">
        <mat-icon>save</mat-icon>
        Save Changes
      </button>
    </mat-dialog-actions>
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
    mat-dialog-content {
      min-width: 400px;
      padding: 20px 0;
    }
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
    }
  `]
})
export class EditExpenseDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EditExpenseDialogComponent>);

  expenseForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { expense: Expense }) {
    this.expenseForm = this.fb.group({
      title: [data.expense.title, [Validators.required]],
      amount: [data.expense.amount, [Validators.required, Validators.min(0.01)]],
      category: [data.expense.category, [Validators.required]],
      date: [data.expense.date, [Validators.required]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.expenseForm.valid) {
      const updatedExpense = {
        ...this.data.expense,
        ...this.expenseForm.value
      };
      this.dialogRef.close(updatedExpense);
    }
  }
}