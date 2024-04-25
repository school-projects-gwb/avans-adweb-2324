import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BookletService } from '../../services/booklet.service';
import { Booklet } from '../../models/booklet.models';
import { Router, RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {
  BookletCreateDialogComponent,
  BookletDialogResult,
} from '../booklet-create-dialog/booklet-create-dialog.component';
import { Firestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booklet-overview',
  standalone: true,
  imports: [RouterModule, NgFor, MatDialogModule, MatInputModule, FormsModule],
  templateUrl: './booklet-overview.component.html',
  styleUrls: ['./booklet-overview.component.css'],
})
export class BookletOverviewComponent implements OnInit, OnDestroy {
  bookletSubscription: Subscription = new Subscription();
  booklets: Booklet[] = [];
  firestore = inject(Firestore);

  constructor(
    private bookletService: BookletService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService
      .getIsAuthenticatedListener()
      .then((observable) => {
        this.bookletSubscription = observable.subscribe((currentUserResult) => {
          if (!currentUserResult.isLoggedIn) this.router.navigate(['/auth']);
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    this.bookletService
      .getBookletListener()
      .then((observable) => {
        this.bookletSubscription = observable.subscribe((booklets) => {
          this.booklets = booklets;
        });
      })
      .catch((error) => {
        console.error('Error fetching booklets:', error);
      });
  }

  async addBooklet(): Promise<void> {
    const dialogRef = this.dialog.open(BookletCreateDialogComponent, {
      width: '270px',
      data: {
        booklet: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe(async (result: BookletDialogResult | undefined) => {
        if (!result) return;
        result.booklet.userId = this.authService.getAuthenticatedUserId();
        await this.bookletService.createBooklet(result.booklet);
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

        if (result.delete) {
          this.bookletService.archiveBooklet(booklet);
        } else {
          this.bookletService.updateBooklet(booklet);
        }
      });
  }

  ngOnDestroy(): void {
    this.bookletSubscription.unsubscribe();
  }
}
