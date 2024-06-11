import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { BookletService } from '../../services/booklet.service';
import { Booklet } from '../../models/booklet.models';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-booklet-archive',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './booklet-archive.component.html',
  styleUrl: './booklet-archive.component.css',
})
export class BookletArchiveComponent implements OnInit {
  currentUserSubscription: Subscription = new Subscription();
  booklets: Booklet[] = [];

  constructor(
    private router: Router,
    private bookletService: BookletService,
    private authService: AuthService
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
              .getBookletListener(currentUserResult, true)
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

  async openOverview(): Promise<void> {
    this.router.navigate(['/']);
  }
  
  async unarchiveBooklet(booklet: Booklet): Promise<void> {
    await this.bookletService.unarchiveBooklet(booklet);
  }
}
