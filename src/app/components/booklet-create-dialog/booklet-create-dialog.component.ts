import { Component, Inject, OnInit } from '@angular/core';
import { Booklet } from '../../models/booklet.models';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booklet-create-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatDialogModule],
  templateUrl: './booklet-create-dialog.component.html',
  styleUrl: './booklet-create-dialog.component.css',
})
export class BookletCreateDialogComponent implements OnInit {
  private backupBooklet: Partial<Booklet> = { ...this.data.booklet };
  formGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<BookletCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookletDialogData,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      userEmailToModifyAccess: [null, [Validators.required, Validators.email]],
    });

    this.formGroup.value;
  }

  onSubmit() {
    console.log(this.formGroup);
  }

  cancel(): void {
    if (this.data.booklet) {
      const booklet = this.data.booklet as Booklet;
      const backupBooklet = this.backupBooklet as Booklet;
      booklet.name = backupBooklet.name;
      booklet.description = backupBooklet.description;
      booklet.authenticatedUserEmails = backupBooklet.authenticatedUserEmails;
    }

    this.dialogRef.close();
  }

  addAuthenticatedUserEmail(emailToAdd: string): void {
    const booklet = this.data.booklet as Booklet;
    booklet.addAuthenticatedUserEmail(emailToAdd);
    this.formGroup.controls['userEmailToModifyAccess'].reset();
  }

  removeAuthenticatedUserEmail(emailToRemove: string): void {
    const booklet = this.data.booklet as Booklet;
    booklet.removeAuthenticatedUserEmail(emailToRemove);
  }
}

export interface BookletDialogData {
  booklet: Partial<Booklet>;
  enableDelete: boolean;
  userEmailToModifyAccess: string;
}

export interface BookletDialogResult {
  booklet: Booklet;
  delete?: boolean;
}
