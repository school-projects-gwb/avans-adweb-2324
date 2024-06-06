import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import { Category } from '../../models/category.models';
import { CategoriesService } from '../../services/categories.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, NgFor],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  @Input() bookletId!: string;
  categories: Category[] = [];
  categoriesSubscription: Subscription = new Subscription();

  constructor(
    private categoriesService: CategoriesService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.bookletId = params.get('id') || '';
    });
    this.authService
      .getIsAuthenticatedListener()
      .then((observable) => {
        this.categoriesSubscription = observable.subscribe(
          (currentUserResult) => {
            if (!currentUserResult.isLoggedIn) {
              this.router.navigate(['/auth']);
              return;
            }
            if (!this.bookletId) {
              console.error('Error: bookletId is undefined');
              return;
            }
            this.categoriesService
              .getCategoriesListener(this.bookletId)
              .then((observable) => {
                this.categoriesSubscription = observable.subscribe(
                  (categories) => {
                    this.categories = categories;
                  }
                );
              })
              .catch((error) => {
                console.error('Error fetching categories:', error);
              });
          }
        );
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe();
  }
}
