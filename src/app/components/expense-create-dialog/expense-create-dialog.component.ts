import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Expense } from '../../models/expense.models';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgFor, NgIf } from '@angular/common';
import { Category } from '../../models/category.models';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-expense-create-dialog',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOption,
    NgFor,
    MatDialogModule,
  ],
  templateUrl: './expense-create-dialog.component.html',
  providers: [MatDatepickerModule, MatNativeDateModule],
})
export class ExpenseCreateDialogComponent {
  formGroup: FormGroup;
  private backupExpense: Partial<Expense> = { ...this.data.expense };

  constructor(
    public dialogRef: MatDialogRef<ExpenseCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExpenseDialogData,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      name: [this.data.expense.name, [Validators.required]],
      amount: [
        this.data.expense.amount,
        [Validators.required, Validators.min(0.01)],
      ],
      date: [this.data.expense.date || new Date(), Validators.required],
      isIncome: [this.data.expense.isIncome ?? false],
      categoryId: [this.data.expense?.categoryId || ''],
    });
  }

  cancel(): void {
    this.data.expense.amount = this.backupExpense.amount;
    this.data.expense.date = this.backupExpense.date;
    this.dialogRef.close();
  }

  save(): void {
    if (this.formGroup.valid) {
      this.data.expense.name = this.formGroup.value.name;
      this.data.expense.amount = this.formGroup.value.amount;
      this.data.expense.date = this.formGroup.value.date;
      this.data.expense.isIncome = this.formGroup.value.isIncome;
      this.data.expense.categoryId = this.formGroup.value.categoryId;
      this.dialogRef.close({ expense: this.data.expense });
    }
  }
}

export interface ExpenseDialogData {
  expense: Partial<Expense>;
  categories: Category[];
  enableDelete: boolean;
}

export interface ExpenseDialogResult {
  expense: Expense;
  delete?: boolean;
}
