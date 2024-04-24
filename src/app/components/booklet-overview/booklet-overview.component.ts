import { Component, OnInit, inject } from '@angular/core';
import { BookletService } from '../../services/booklet.service';
import { Booklet } from '../../models/booklet.models';
import { RouterModule } from '@angular/router';
import { BOOKLETS } from '../../mock-data/mock-booklets';
import { NgFor } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {
  BookletCreateDialogComponent,
  BookletDialogResult,
} from '../booklet-create-dialog/booklet-create-dialog.component';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-booklet-overview',
  standalone: true,
  imports: [RouterModule, NgFor, MatDialogModule, MatInputModule, FormsModule],
  templateUrl: './booklet-overview.component.html',
  styleUrls: ['./booklet-overview.component.css'],
})
export class BookletOverviewComponent implements OnInit {
  booklets: Booklet[] = [];
  firestore = inject(Firestore);

  constructor(
    private bookletService: BookletService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getBooklets();

    getDocs(collection(this.firestore, "booklet")).then((response) => {
      console.log(response.docs)
    })
  }

  getBooklets(): void {
    this.bookletService.getBooklets().subscribe(
      (booklets) => {
        this.booklets = BOOKLETS;
        console.log('Fetched booklets:', booklets);
        // TODO: Filter booklets based on logged-in user
        // Edge case: If no booklets are returned, consider displaying a message or redirecting the user
      },
      (error) => {
        console.error('Error fetching booklets:', error); // Error handling and logging
        // Suggestion: Implement user-friendly error handling here, e.g., display a message in the UI
      }
    );
  }

  addBooklet(): void {
    const dialogRef = this.dialog.open(BookletCreateDialogComponent, {
      width: '270px',
      data: {
        booklet: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: BookletDialogResult | undefined) => {
        console.log(result);
        if (!result) return;
        this.booklets.push(result.booklet);
      });
  }

  editBooklet(booklet: Booklet): void {
    const dialogRef = this.dialog.open(BookletCreateDialogComponent, {
      width: '270px',
      data: {
        booklet,
        enableDelete: true,
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: BookletDialogResult | undefined) => {
        if (!result) {
          return;
        }

        const bookletIndex = this.booklets.indexOf(booklet);
        if (result.delete) {
          this.booklets.splice(bookletIndex, 1);
        } else {
          this.booklets[bookletIndex] = booklet;
        }
      });
  }
}
