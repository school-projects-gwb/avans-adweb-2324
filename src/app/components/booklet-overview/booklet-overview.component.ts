import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BookletService } from '../../services/booklet.service';
import { Booklet } from '../../models/booklet.models';
import { Router, RouterModule } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
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
  imports: [
    RouterModule,
    NgIf,
    NgFor,
    MatDialogModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './booklet-overview.component.html',
  styleUrls: ['./booklet-overview.component.css'],
})
export class BookletOverviewComponent implements OnInit, OnDestroy {
  currentUserSubscription: Subscription = new Subscription();
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
        this.currentUserSubscription = observable.subscribe(
          (currentUserResult) => {
            if (!currentUserResult.isLoggedIn) {
              this.router.navigate(['/auth']);
              return;
            }

            this.bookletService
              .getBookletListener(currentUserResult.email)
              .then((observable) => {
                this.currentUserSubscription = observable.subscribe(
                  (booklets) => {
                    this.booklets = booklets;
                  }
                );
              })
              .catch((error) => {
                console.error('Error fetching booklets:', error);
              });
          }
        );
      })
      .catch((error) => {
        console.error('Error:', error);
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

  openBooklet(booklet: Booklet): void {
    // TODO navigate
    console.log(booklet.id);
  }

  openArchive(): void {
    this.router.navigate(['archive']);
  }

  editBooklet(booklet: Booklet): void {
    const dialogRef = this.dialog.open(BookletCreateDialogComponent, {
      width: '800px',
      data: {
        booklet,
        enableDelete: true,
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: BookletDialogResult | undefined) => {
        if (!result) return;

        result.delete
          ? this.bookletService.archiveBooklet(booklet)
          : this.bookletService.updateBooklet(booklet);
      });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }
}
