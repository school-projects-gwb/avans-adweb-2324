import { Component, Inject, OnInit } from '@angular/core';
import { Category } from '../../models/category.models';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-category-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  providers: [MatDatepickerModule],
  templateUrl: './category-create-dialog.component.html',
})
export class CategoryCreateDialogComponent implements OnInit {
  private backupCategory: Partial<Category> = { ...this.data.category };
  formGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CategoryCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: [
        this.data.category?.name || '',
        [Validators.required, Validators.minLength(1)],
      ],
      budget: [
        this.data.category?.budget || '',
        [Validators.required, Validators.min(1)],
      ],
      targetDate: [this.data.category?.targetDate || null],
    });
  }

  save(): void {
    if (!this.formGroup.valid) return;

    this.dialogRef.close({
      category: this.formGroup.value,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

export interface CategoryDialogData {
  category: Partial<Category>;
  enableDelete: boolean;
}

export interface CategoryDialogResult {
  category: Category;
  delete?: boolean;
}
