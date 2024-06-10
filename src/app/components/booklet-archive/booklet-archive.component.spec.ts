/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { BookletArchiveComponent } from './booklet-archive.component';
import { BookletService } from '../../services/booklet.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Booklet } from '../../models/booklet.models';

class MockAuthService {
  getIsAuthenticatedListener() {
    return Promise.resolve(of({ isLoggedIn: true }));
  }
}

class MockBookletService {
  getBookletListener(currentUser: unknown, archived: boolean) {
    return Promise.resolve(of([]));
  }

  unarchiveBooklet(booklet: Booklet) {
    return Promise.resolve();
  }
}

describe('BookletArchiveComponent', () => {
  let component: BookletArchiveComponent;
  let fixture: ComponentFixture<BookletArchiveComponent>;
  let router: Router;
  let authService: AuthService;
  let bookletService: BookletService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookletArchiveComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: BookletService, useClass: MockBookletService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookletArchiveComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    bookletService = TestBed.inject(BookletService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if user is not authenticated', fakeAsync(() => {
    spyOn(authService, 'getIsAuthenticatedListener').and.returnValue(Promise.resolve(of({ isLoggedIn: false, email: '', userId: ''})));
    spyOn(router, 'navigate');
    component.ngOnInit();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  }));

  it('should fetch archived booklets on init', fakeAsync(() => {
    spyOn(bookletService, 'getBookletListener').and.returnValue(Promise.resolve(of([new Booklet('1', '', 'Booklet 1', 'testUserId')])));
    component.ngOnInit();
    tick();
    expect(component.booklets.length).toBe(1);
    expect(component.booklets[0].name).toBe('Booklet 1');
  }));

  it('should navigate to overview', () => {
    spyOn(router, 'navigate');
    component.openOverview();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should unarchive booklet', async () => {
    spyOn(bookletService, 'unarchiveBooklet').and.returnValue(Promise.resolve());
    const booklet = new Booklet('1', 'Booklet 1', '', 'testUserId');
    await component.unarchiveBooklet(booklet);
    expect(bookletService.unarchiveBooklet).toHaveBeenCalledWith(booklet);
  });
});
