import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Category } from '../../models/category.models';
import { CategoriesService } from '../../services/categories.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  CategoryCreateDialogComponent,
  CategoryDialogResult,
} from '../category-create-dialog/category-create-dialog.component';
import {
  CdkDrag,
  CdkDragPlaceholder,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, NgFor, CdkDragPlaceholder],
  templateUrl: './category-overview.component.html',
  styleUrl: './category-overview.component.css',
})
export class CategoryOverviewComponent implements OnInit, OnDestroy {
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

  onDragStart(event: Event) {
    console.log(event);
  }

  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe();
  }

  async addCategory(): Promise<void> {
    const dialogRef = this.dialog.open(CategoryCreateDialogComponent, {
      width: '270px',
      data: {
        category: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe(async (result: CategoryDialogResult | undefined) => {
        if (!result) return;
        result.category.bookletId = this.bookletId;
        await this.categoriesService.createCategory(result.category);
      });
  }

  editCategory(category: Category): void {
    const dialogRef = this.dialog.open(CategoryCreateDialogComponent, {
      width: '800px',
      data: {
        category,
        enableDelete: true,
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: CategoryDialogResult | undefined) => {
        if (!result) return;
        category.bookletId = this.bookletId;
        category.name = result.category.name;
        category.budget = result.category.budget;
        category.targetDate = result.category.targetDate;

        result.delete
          ? this.categoriesService.deleteCategory(category)
          : this.categoriesService.updateCategory(category);
      });
  }
}
