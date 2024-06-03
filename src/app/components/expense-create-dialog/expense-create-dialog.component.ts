import { Component, Inject } from '@angular/core';
import { Expense } from '../../models/expense.models';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-expense-create-dialog',
  standalone: true,
  imports: [NgIf, FormsModule, MatInputModule, MatDialogModule],
  templateUrl: './expense-create-dialog.component.html',
  styleUrls: ['./expense-create-dialog.component.css']
})
export class ExpenseCreateDialogComponent {
  private backupExpense: Partial<Expense> = { ...this.data.expense };

  constructor(
    public dialogRef: MatDialogRef<ExpenseCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExpenseDialogData
  ) {}

  cancel(): void {
    this.data.expense.amount = this.backupExpense.amount;
    this.data.expense.bookletId = this.backupExpense.bookletId;
    this.data.expense.date = this.backupExpense.date;
    this.dialogRef.close();
  }
}

export interface ExpenseDialogData {
  expense: Partial<Expense>;
  enableDelete: boolean;
}

export interface ExpenseDialogResult {
  expense: Expense;
  delete?: boolean;
}
