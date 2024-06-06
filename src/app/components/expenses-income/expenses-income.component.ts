import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Import Angular Material modules
import { MatInputModule } from '@angular/material/input'; // Import Angular Material modules
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatDialog } from '@angular/material/dialog';
import { ExpenseCreateDialogComponent, ExpenseDialogResult } from '../expense-create-dialog/expense-create-dialog.component';
import { AuthService } from '../../services/auth.service';
import { ExpensesService } from '../../services/expenses.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CategoriesComponent } from "../categories/categories.component";

@Component({
    selector: 'app-expenses-income',
    templateUrl: './expenses-income.component.html',
    styleUrls: ['./expenses-income.component.css'], // Add CommonModule to imports in the standalone component
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, CommonModule, CategoriesComponent]
})
export class ExpensesIncomeComponent implements OnInit, OnDestroy {
  @Input() bookletId!: string;  
  expenses: Expense[] = [];  
  income: Income[] = []; 
  newExpense: Partial<Expense> = {};
  expensesSubscription: Subscription = new Subscription();

  constructor(private expensesService: ExpensesService, private authService: AuthService, private firestore: Firestore, private router: Router, private dialog: MatDialog, private route: ActivatedRoute) { }  

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookletId = params.get('id') || '';
    });
    this.authService
      .getIsAuthenticatedListener()
      .then((observable) => {
        this.expensesSubscription = observable.subscribe((currentUserResult) => {
          if (!currentUserResult.isLoggedIn) {
            this.router.navigate(['/auth']);
            return;
          }
          if (!this.bookletId) {
            console.error('Error: bookletId is undefined');
            return;
          }
          this.expensesService
            .getExpensesListener(this.bookletId)
            .then((observable) => {
              this.expensesSubscription = observable.subscribe((expenses) => {
                this.expenses = expenses;
              });
            })
            .catch((error) => {
              console.error('Error fetching expenses:', error);
            });
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  ngOnDestroy(): void {
    this.expensesSubscription.unsubscribe();
  }

  async addExpense(): Promise<void> {
    const dialogRef = this.dialog.open(ExpenseCreateDialogComponent, {
      width: '270px',
      data: {
        expense: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe(async (result: ExpenseDialogResult | undefined) => {
        if (!result) return;
        await this.expensesService.createExpense(result.expense);
      });
  }
}

export interface Expense {
  id?: string;
  date: Date;
  amount: number;
  bookletId: string;
}

export interface Income {
  id?: string;
  date: Date;
  amount: number;
  bookletId: string;
}
