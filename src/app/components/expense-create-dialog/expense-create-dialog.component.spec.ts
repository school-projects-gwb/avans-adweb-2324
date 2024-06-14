import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ExpenseCreateDialogComponent,
  ExpenseDialogData,
} from './expense-create-dialog.component';
import { Firestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockFirestore {}

describe('ExpenseCreateDialogComponent', () => {
  let component: ExpenseCreateDialogComponent;
  let fixture: ComponentFixture<ExpenseCreateDialogComponent>;
  let dialogRef: MatDialogRef<ExpenseCreateDialogComponent>;

  const mockDialogData: ExpenseDialogData = {
    expense: {
      name: 'Test Expense',
      amount: 100,
      date: new Date(),
      isIncome: false,
      categoryId: '1',
    },
    categories: [
      {
        id: '1',
        name: 'Category 1',
        budget: 500,
        totalAmount: 100,
        targetDate: new Date(),
        bookletId: '1',
      },
    ],
    enableDelete: false,
  };

  beforeEach(async () => {
    const mockDialogRef = {
      close: jasmine.createSpy('close'),
    };

    await TestBed.configureTestingModule({
      imports: [
        ExpenseCreateDialogComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: Firestore, useClass: MockFirestore },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseCreateDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with data', () => {
    expect(component.formGroup.value).toEqual({
      name: 'Test Expense',
      amount: 100,
      date: mockDialogData.expense.date,
      isIncome: false,
      categoryId: '1',
    });
  });

  it('should not close the dialog when form is invalid on save', () => {
    component.formGroup.controls['name'].setValue('');
    component.save();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close the dialog with form data when form is valid on save', () => {
    component.save();
    expect(dialogRef.close).toHaveBeenCalledWith({
      expense: {
        name: 'Test Expense',
        amount: 100,
        date: mockDialogData.expense.date,
        isIncome: false,
        categoryId: '1',
      },
    });
  });

  it('should close the dialog on cancel', () => {
    component.cancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
