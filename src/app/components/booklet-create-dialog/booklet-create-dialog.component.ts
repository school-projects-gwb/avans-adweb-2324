import { Component, Inject } from '@angular/core';
import { Booklet } from '../../models/booklet.models';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-booklet-create-dialog',
  standalone: true,
  imports: [NgIf, FormsModule, MatInputModule, MatDialogModule],
  templateUrl: './booklet-create-dialog.component.html',
  styleUrl: './booklet-create-dialog.component.css'
})
export class BookletCreateDialogComponent {
  private backupBooklet: Partial<Booklet> = { ...this.data.booklet };

  constructor(
    public dialogRef: MatDialogRef<BookletCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookletDialogData
  ) {}

  cancel(): void {
    this.data.booklet.name = this.backupBooklet.name;
    this.data.booklet.description = this.backupBooklet.description;
    this.dialogRef.close();
  }
}

export interface BookletDialogData {
  booklet: Partial<Booklet>;
  enableDelete: boolean;
}

export interface BookletDialogResult {
  booklet: Booklet;
  delete?: boolean;
}


