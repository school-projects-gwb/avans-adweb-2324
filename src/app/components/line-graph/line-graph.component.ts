import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { ExpenseConfigData, ExpensesService } from '../../services/expenses.service';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Expense } from '../expenses-income/expenses-income.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-line-graph',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css'],
})
export class LineGraphComponent implements OnInit, OnDestroy {
  isBrowser: boolean = true;
  title = 'ng2-charts-demo';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };

  public lineChartLegend = true;

  expenses: Expense[] = [];
  expensesSubscription: Subscription = new Subscription();

  data: ExpenseConfigData | null = null;

  constructor(
    private expensesService: ExpensesService,
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.expensesService.currentData.subscribe((data) => {
      const isInitial = this.data === null;
      this.data = data;
      if (!isInitial) this.fetchExpensesAndIncome();
    });

    this.expensesService.getCombinedData().subscribe(({ data, isAuthenticated }) => {
      if (!isAuthenticated) {
        this.router.navigate(['/auth']);
        return;
      }

      if (!data?.bookletId) {
        console.error('Error: bookletId is undefined');
        return;
      }

      this.fetchExpensesAndIncome();
    });
  }

  ngOnDestroy(): void {
    this.expensesSubscription.unsubscribe();
  }

  fetchExpensesAndIncome(): void {
    const endDate = new Date(this.data?.year ?? 2024, this.data?.month ?? 1, 0);

    this.expensesService
      .getExpensesListener(
        this.data?.bookletId ?? '',
        this.data?.month ?? 1,
        this.data?.year ?? 2024
      )
      .then((observable) => {
        this.expensesSubscription = observable.subscribe((expenses) => {
          const daysInMonth = endDate.getDate();
          const incomeData: number[] = Array(daysInMonth).fill(0);
          const expenseData: number[] = Array(daysInMonth).fill(0);

          expenses.forEach((expense) => {
            const expenseDate = new Date(expense.date);
            const dayOfMonth = expenseDate.getDate();
            if (expense.isIncome) {
              incomeData[dayOfMonth - 1] += expense.amount;
            } else {
              expenseData[dayOfMonth - 1] += expense.amount;
            }
          });

          const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);

          this.lineChartData = {
            labels: labels,
            datasets: [
              {
                data: expenseData,
                label: 'Uitgaven',
                fill: false,
                borderColor: 'red',
                tension: 0.4,
              },
              {
                data: incomeData,
                label: 'Inkomsten',
                fill: false,
                borderColor: 'green',
                tension: 0.4,
              },
            ],
          };
        });
      })
      .catch((error) => {
        console.error('Error fetching expenses:', error);
      });
  }
}
