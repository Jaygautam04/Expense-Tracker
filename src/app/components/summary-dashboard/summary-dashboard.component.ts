import { Component, inject, computed, OnInit, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { ExpenseService } from '../../services/expense.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-summary-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-grid-list cols="1" rowHeight="200px" [cols]="breakpoint" (window:resize)="onResize($event)">
        
        <!-- Total Expenses Card -->
        <mat-grid-tile>
          <mat-card class="summary-card total-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>account_balance_wallet</mat-icon>
                </div>
                <div class="stat-info">
                  <h2 class="stat-number">\${{totalExpenses() | number:'1.2-2'}}</h2>
                  <p class="stat-label">Total Expenses</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Expense Count Card -->
        <mat-grid-tile>
          <mat-card class="summary-card count-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>receipt</mat-icon>
                </div>
                <div class="stat-info">
                  <h2 class="stat-number">{{expenseCount()}}</h2>
                  <p class="stat-label">Total Transactions</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Average Expense Card -->
        <mat-grid-tile>
          <mat-card class="summary-card average-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>trending_up</mat-icon>
                </div>
                <div class="stat-info">
                  <h2 class="stat-number">\${{averageExpense() | number:'1.2-2'}}</h2>
                  <p class="stat-label">Average per Transaction</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

      </mat-grid-list>

      <!-- Category Breakdown Chart -->
      <mat-card class="chart-card" *ngIf="hasExpenses()">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>pie_chart</mat-icon>
            Expenses by Category
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="chart-container">
            <canvas #chartCanvas></canvas>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Category List -->
      <mat-card class="categories-card" *ngIf="hasExpenses()">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>category</mat-icon>
            Category Breakdown
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="category-list">
            <div *ngFor="let category of categoryList()" class="category-item">
              <div class="category-info">
                <span class="category-name">{{getCategoryIcon(category.name)}} {{category.name}}</span>
                <span class="category-amount">\${{category.amount | number:'1.2-2'}}</span>
              </div>
              <div class="category-percentage">
                {{category.percentage}}%
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      margin-bottom: 24px;
    }
    .summary-card {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
    }
    .stat-icon {
      padding: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .total-card .stat-icon {
      background: linear-gradient(45deg, #4CAF50, #8BC34A);
      color: white;
    }
    .count-card .stat-icon {
      background: linear-gradient(45deg, #2196F3, #03A9F4);
      color: white;
    }
    .average-card .stat-icon {
      background: linear-gradient(45deg, #FF9800, #FFC107);
      color: white;
    }
    .stat-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    .stat-info {
      flex: 1;
    }
    .stat-number {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
      color: #333;
    }
    .stat-label {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 14px;
    }
    .chart-card, .categories-card {
      margin-top: 24px;
    }
    .chart-container {
      position: relative;
      height: 300px;
      width: 100%;
    }
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .category-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fafafa;
    }
    .category-info {
      display: flex;
      justify-content: space-between;
      flex: 1;
      margin-right: 16px;
    }
    .category-name {
      font-weight: 500;
    }
    .category-amount {
      font-weight: bold;
      color: #e91e63;
    }
    .category-percentage {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }
  `]
})
export class SummaryDashboardComponent implements OnInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private expenseService = inject(ExpenseService);
  private chart: Chart | null = null;
  breakpoint = 1;

  expenses = this.expenseService.expenses;
  summary = computed(() => this.expenseService.getSummary());
  
  totalExpenses = computed(() => this.summary().total);
  expenseCount = computed(() => this.expenses().length);
  averageExpense = computed(() => {
    const count = this.expenseCount();
    return count > 0 ? this.totalExpenses() / count : 0;
  });
  hasExpenses = computed(() => this.expenseCount() > 0);
  
  categoryList = computed(() => {
    const breakdown = this.summary().categoryBreakdown;
    const total = this.totalExpenses();
    
    return Object.entries(breakdown).map(([name, amount]) => ({
      name,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0
    })).sort((a, b) => b.amount - a.amount);
  });

  constructor() {
    // Reactive chart updates using Angular effects
    effect(() => {
      if (this.hasExpenses() && this.chartCanvas?.nativeElement) {
        this.updateChart();
      } else if (!this.hasExpenses() && this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
    });
  }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 768) ? 1 : 3;
  }

  ngAfterViewInit() {
    // Initial chart creation if we have data
    setTimeout(() => {
      if (this.hasExpenses()) {
        this.updateChart();
      }
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  onResize(event: any) {
    this.breakpoint = (event.target.innerWidth <= 768) ? 1 : 3;
  }

  private updateChart() {
    if (!this.chartCanvas?.nativeElement || !this.hasExpenses()) return;

    const categories = this.categoryList();
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    
    if (ctx) {
      // Destroy existing chart if it exists
      if (this.chart) {
        this.chart.destroy();
      }

      // Create new chart with current data
      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categories.map(c => c.name),
          datasets: [{
            data: categories.map(c => c.amount),
            backgroundColor: [
              '#4CAF50',
              '#2196F3', 
              '#FF9800',
              '#E91E63'
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            }
          }
        }
      });
    }
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