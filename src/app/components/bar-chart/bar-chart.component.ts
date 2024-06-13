import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ExpenseConfigData,
  ExpensesService,
} from '../../services/expenses.service';
import { CategoriesService } from '../../services/categories.service';
import { Expense } from '../expenses-income/expenses-income.component';
import { Subscription } from 'rxjs';
import { Category } from '../../models/category.models';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements OnInit {
  public barChartLegend = true;
  public barChartPlugins = [];
  isBrowser: boolean;
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    datasets: [],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  expenses: Expense[] = [];
  expensesSubscription: Subscription = new Subscription();

  categories: Category[] = [];
  categoriesSubscription: Subscription = new Subscription();

  data: ExpenseConfigData | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private expensesService: ExpensesService,
    private categoriesService: CategoriesService,
    private authService: AuthService,
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

    this.authService
      .getIsAuthenticatedListener()
      .then((observable) => {
        this.expensesSubscription = observable.subscribe(
          (currentUserResult) => {
            if (!currentUserResult.isLoggedIn) {
              this.router.navigate(['/auth']);
              return;
            }
            if (!this.data?.bookletId) {
              console.error('Error: bookletId is undefined');
              return;
            }

            this.categoriesService
              .getCategoriesListener(this.data?.bookletId ?? '')
              .then((observable) => {
                this.categoriesSubscription = observable.subscribe(
                  (categories) => {
                    this.categories = categories;
                  }
                );
              })
              .catch((error) => {
                console.error('Error fetching categories:', error);
              });

            this.fetchExpensesAndIncome();
          }
        );
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    this.barChartData = {
      labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
      datasets: [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
      ],
    };
  }

  fetchExpensesAndIncome(): void {
    this.expensesService
      .getExpensesListener(
        this.data?.bookletId ?? '',
        this.data?.month ?? 1,
        this.data?.year ?? 2024
      )
      .then((observable) => {
        this.expensesSubscription = observable.subscribe((expenses) => {
          const mappedExpenses = expenses.map((expense) => {
            const category = this.categories.find(
              (c) => c.id === expense.categoryId
            );
            return {
              ...expense,
              categoryName: category ? category.name : '/',
            };
          });

          this.expenses = mappedExpenses;

          const categoryTotals: CategoryTotals = this.categories.reduce(
            (acc, category) => {
              acc[category.name] = { spent: 0, received: 0 };
              return acc;
            },
            {} as CategoryTotals
          );

          mappedExpenses.forEach((expense) => {
            if (expense.isIncome) {
              categoryTotals[expense.categoryName].received += expense.amount;
            } else {
              categoryTotals[expense.categoryName].spent += expense.amount;
            }
          });

          const labels = Object.keys(categoryTotals);
          const spentData = labels.map((label) => categoryTotals[label].spent);
          const receivedData = labels.map(
            (label) => categoryTotals[label].received
          );

          this.barChartData = {
            labels: labels,
            datasets: [
              { data: spentData, label: 'Spent' },
              { data: receivedData, label: 'Received' },
            ],
          };
        });
      })
      .catch((error) => {
        console.error('Error fetching expenses:', error);
      });
  }
}

interface CategoryTotals {
  [key: string]: {
    spent: number;
    received: number;
  };
}
