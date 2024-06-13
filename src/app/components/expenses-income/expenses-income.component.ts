import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {
  ExpenseCreateDialogComponent,
  ExpenseDialogResult,
} from '../expense-create-dialog/expense-create-dialog.component';
import { ExpenseConfigData, ExpensesService } from '../../services/expenses.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CategoryOverviewComponent } from '../category-overview/category-overview.component';
import { Category } from '../../models/category.models';
import { CategoriesService } from '../../services/categories.service';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { LineGraphComponent } from '../line-graph/line-graph.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';

@Component({
  selector: 'app-expenses-income',
  templateUrl: './expenses-income.component.html',
  styleUrls: ['./expenses-income.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    CategoryOverviewComponent,
    CdkDropList,
    CdkDrag,
    LineGraphComponent,
    BarChartComponent,
  ],
})
export class ExpensesIncomeComponent implements OnInit, OnDestroy {
  @Input() bookletId!: string;

  expenses: Expense[] = [];
  income: Expense[] = [];
  expensesSubscription: Subscription = new Subscription();

  categories: Category[] = [];
  categoriesSubscription: Subscription = new Subscription();

  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();

  months = [
    { value: 0, name: 'Januari' },
    { value: 1, name: 'Februari' },
    { value: 2, name: 'Maart' },
    { value: 3, name: 'April' },
    { value: 4, name: 'Mei' },
    { value: 5, name: 'Juni' },
    { value: 6, name: 'Juli' },
    { value: 7, name: 'Augustus' },
    { value: 8, name: 'September' },
    { value: 9, name: 'Oktober' },
    { value: 10, name: 'November' },
    { value: 11, name: 'December' },
  ];
  years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  constructor(
    private expensesService: ExpensesService,
    private categoriesService: CategoriesService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.bookletId = params.get('id') || '';
      this.updateExpenseConfigData();
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

      this.fetchCategories(data.bookletId);
      this.fetchExpensesAndIncome(data.bookletId, data.month, data.year);
    });
  }

  ngOnDestroy(): void {
    this.expensesSubscription.unsubscribe();
    this.categoriesSubscription.unsubscribe();
  }

  private fetchCategories(bookletId: string) {
    this.categoriesService.getCategoriesListener(bookletId).then((observable) => {
      this.categoriesSubscription = observable.subscribe((categories) => {
        this.categories = categories;
      });
    }).catch((error) => {
      console.error('Error fetching categories:', error);
    });
  }

  async onDrop(event: CdkDragDrop<unknown[]>) {
    const droppedItem = event.item.data;
    if (!droppedItem) return;

    const dropIndex = (event.currentIndex == 0 ? 1 : event.currentIndex) - 1;

    const isExpense = event.container.id === 'expense-component';
    const target = isExpense
      ? this.expenses[dropIndex]
      : this.income[dropIndex];

    if (!target) return;

    target.categoryId = droppedItem.id;
    await this.expensesService.updateExpense(target);
  }

  onDateChange(): void {
    this.updateExpenseConfigData();
    this.fetchExpensesAndIncome(this.bookletId, this.selectedMonth, this.selectedYear);
  }

  private updateExpenseConfigData() {
    const data: ExpenseConfigData = {
      bookletId: this.bookletId,
      month: this.selectedMonth,
      year: this.selectedYear,
    };

    this.expensesService.updateExpenseConfigData(data);
  }

  fetchExpensesAndIncome(bookletId: string, month: number, year: number): void {
    this.expensesService.getExpensesListener(bookletId, month, year).then((observable) => {
      this.expensesSubscription = observable.subscribe((expenses) => {
        const mappedExpenses = expenses.map((expense) => {
          const category = this.categories.find((c) => c.id === expense.categoryId);
          return { ...expense, categoryName: category ? category.name : '/' };
        });

        this.expenses = mappedExpenses.filter((expense) => !expense.isIncome);
        this.income = mappedExpenses.filter((expense) => expense.isIncome);
      });
    }).catch((error) => {
      console.error('Error fetching expenses:', error);
    });
  }

  async addExpenseOrIncome(): Promise<void> {
    const dialogRef = this.dialog.open(ExpenseCreateDialogComponent, {
      width: '270px',
      data: {
        categories: this.categories,
        expense: {
          bookletId: this.bookletId,
          name: '',
          isIncome: false,
          date: new Date(),
        },
      },
    });
    dialogRef
      .afterClosed()
      .subscribe(async (result: ExpenseDialogResult | undefined) => {
        if (!result) return;
        await this.expensesService.createExpense(result.expense);
      });
  }

  async deleteExpense(expenseId: string | undefined): Promise<void> {
    if (!expenseId) return;
    await this.expensesService.deleteExpense(expenseId);
    this.fetchExpensesAndIncome(this.bookletId, this.selectedMonth, this.selectedYear);
  }

  editExpense(expense: Expense): void {
    const dialogRef = this.dialog.open(ExpenseCreateDialogComponent, {
      width: '270px',
      data: {
        categories: this.categories,
        expense: { ...expense },
      },
    });
    dialogRef
      .afterClosed()
      .subscribe(async (result: ExpenseDialogResult | undefined) => {
        if (!result) return;
        await this.expensesService.updateExpense(result.expense);
      });
  }
}

export interface Expense {
  id: string;
  date: Date;
  amount: number;
  bookletId: string;
  name: string;
  isIncome: boolean;
  categoryId: string;
  categoryName: string;
}
