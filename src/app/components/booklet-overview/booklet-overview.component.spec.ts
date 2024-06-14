/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Observable, of, switchMap } from 'rxjs';
import { BookletOverviewComponent } from './booklet-overview.component';
import { BookletService } from '../../services/booklet.service';
import { AuthService, CurrentUserResult } from '../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Booklet } from '../../models/booklet.models';
import { Firestore } from '@angular/fire/firestore';

class MockAuthService {
  getIsAuthenticatedListener() {
    return Promise.resolve(of({ isLoggedIn: true, email: 'test@example.com' }));
  }

  getAuthenticatedUserId() {
    return 'testUserId';
  }

  getAuthenticatedUserEmail() {
    return 'test@example.com';
  }
}

class MockBookletService {
  getBookletListener(currentUser: unknown) {
    return Promise.resolve(of([]));
  }

  createBooklet(booklet: Booklet, email: string) {
    return Promise.resolve();
  }

  updateBooklet(booklet: Booklet) {
    return Promise.resolve();
  }

  archiveBooklet(booklet: Booklet) {
    return Promise.resolve();
  }

  getCombinedUserAndBooklets(
    archived: boolean = false
  ): Observable<{ currentUserResult: CurrentUserResult; booklets: Booklet[] }> {
    const mockCurrentUserResult: CurrentUserResult = {
      isLoggedIn: true,
      email: 'mock@example.com',
      userId: 'mockUserId',
    };

    return of(mockCurrentUserResult).pipe(
      switchMap((currentUserResult) =>
        of({ currentUserResult, booklets: [] })
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

class MockFirestore {}

const createMockBooklet = (): Booklet => {
  return new Booklet('1', 'testUserId', 'Booklet 1', '');
};

describe('BookletOverviewComponent', () => {
  let component: BookletOverviewComponent;
  let fixture: ComponentFixture<BookletOverviewComponent>;
  let router: Router;
  let authService: AuthService;
  let bookletService: BookletService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, BookletOverviewComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: BookletService, useClass: MockBookletService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: Firestore, useClass: MockFirestore },
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

    fixture = TestBed.createComponent(BookletOverviewComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    bookletService = TestBed.inject(BookletService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if user is not authenticated', fakeAsync(() => {
    spyOn(bookletService, 'getCombinedUserAndBooklets').and.returnValue(
      of({
        currentUserResult: { userId: '', email: '', isLoggedIn: false },
        booklets: [],
      })
    );
    spyOn(router, 'navigate');
    component.ngOnInit();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  }));

  it('should fetch booklets on init', fakeAsync(() => {
    spyOn(bookletService, 'getCombinedUserAndBooklets').and.returnValue(
      of({
        currentUserResult: {
          userId: 'testUserId',
          email: 'test@example.com',
          isLoggedIn: true,
        },
        booklets: [createMockBooklet()],
      })
    );
    component.ngOnInit();
    tick();
    expect(component.booklets.length).toBe(1);
    expect(component.booklets[0].name).toBe('Booklet 1');
  }));

  it('should open booklet on openBooklet call', fakeAsync(() => {
    spyOn(router, 'navigate');
    const booklet = createMockBooklet();
    component.openBooklet(booklet);
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/huishoudboekje', '1']);
  }));

  it('should unsubscribe on destroy', () => {
    const subscriptionSpy = spyOn(
      component.combinedSubscription,
      'unsubscribe'
    ).and.callThrough();
    component.ngOnDestroy();
    expect(subscriptionSpy).toHaveBeenCalled();
  });
});
