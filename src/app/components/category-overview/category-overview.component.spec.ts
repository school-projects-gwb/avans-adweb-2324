/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CategoryOverviewComponent } from './category-overview.component';
import { CategoriesService } from '../../services/categories.service';
import { AuthService, CurrentUserResult } from '../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Category } from '../../models/category.models';

class MockAuthService {
  getIsAuthenticatedListener() {
    return Promise.resolve(of({ isLoggedIn: true, email: 'test@example.com' }));
  }
}

class MockCategoriesService {
  getCategoriesListener(bookletId: string) {
    return Promise.resolve(of([]));
  }

  createCategory(category: Category) {
    return Promise.resolve();
  }

  updateCategory(category: Category) {
    return Promise.resolve();
  }

  deleteCategory(category: Category) {
    return Promise.resolve();
  }

  getCombinedUserAndCategories(
    bookletId: string
  ): Observable<{
    currentUserResult: CurrentUserResult;
    categories: Category[];
  }> {
    const mockCurrentUserResult: CurrentUserResult = {
      isLoggedIn: true,
      email: 'mock@example.com',
      userId: 'mockUserId',
    };

    const mockCategories: Category[] = [
      {
        name: 'Category 1',
        bookletId,
        budget: 100,
        targetDate: new Date(),
        id: '',
        totalAmount: 100,
      },
    ];

    return of(mockCurrentUserResult).pipe(
      switchMap((currentUserResult) =>
        of({ currentUserResult, categories: mockCategories })
      )
    );
  }
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(undefined),
    };
  }
}

describe('CategoryOverviewComponent', () => {
  let component: CategoryOverviewComponent;
  let fixture: ComponentFixture<CategoryOverviewComponent>;
  let router: Router;
  let authService: AuthService;
  let categoriesService: CategoriesService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, CategoryOverviewComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: CategoriesService, useClass: MockCategoriesService },
        { provide: MatDialog, useClass: MockMatDialog },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => 'testBookletId',
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryOverviewComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    categoriesService = TestBed.inject(CategoriesService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and set bookletId', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component.bookletId).toBe('testBookletId');
  }));

  it('should navigate to login if user is not authenticated', fakeAsync(() => {
    spyOn(categoriesService, 'getCombinedUserAndCategories').and.returnValue(
      of({
        currentUserResult: { isLoggedIn: false, userId: '', email: '' },
        categories: [],
      })
    );
    spyOn(router, 'navigate');
    component.ngOnInit();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  }));

  it('should fetch categories on init', fakeAsync(() => {
    spyOn(categoriesService, 'getCombinedUserAndCategories').and.returnValue(
      of({
        currentUserResult: {
          userId: 'mockUserId',
          email: 'mock@example.com',
          isLoggedIn: true,
        },
        categories: [
          {
            name: 'Category 1',
            bookletId: 'testBookletId',
            budget: 100,
            targetDate: new Date(),
            expenses: [],
            id: '',
            totalAmount: 100,
          },
        ],
      })
    );
    component.ngOnInit();
    tick();
    expect(component.categories.length).toBe(1);
    expect(component.categories[0].name).toBe('Category 1');
  }));

  it('should open dialog to add category', () => {
    const dialogSpy = spyOn(dialog, 'open').and.callThrough();
    component.addCategory();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('should open dialog to edit category', () => {
    const dialogSpy = spyOn(dialog, 'open').and.callThrough();
    const category: Category = {
      name: 'Category 1',
      budget: 100,
      targetDate: new Date(),
      bookletId: 'testBookletId',
      id: '',
      totalAmount: 100,
    };
    component.editCategory(category);
    expect(dialogSpy).toHaveBeenCalled();
  });
});
