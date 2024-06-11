import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoggedInUserComponent } from './logged-in-user.component';
import { AuthService } from '../../services/auth.service';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

class MockAuthService {
  getIsAuthenticatedListener() {
    return Promise.resolve(of({ isLoggedIn: true, email: 'test@example.com' }));
  }

  logout() {
    return Promise.resolve(true);
  }
}

class MockFirestore {}

describe('LoggedInUserComponent', () => {
  let component: LoggedInUserComponent;
  let fixture: ComponentFixture<LoggedInUserComponent>;
  let router: Router;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggedInUserComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Firestore, useClass: MockFirestore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoggedInUserComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and set user email', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component.userEmail).toBe('test@example.com');
  }));

  it('should navigate to login on logout', fakeAsync(() => {
    spyOn(router, 'navigate');
    component.logout();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  }));

  it('should navigate to login if user is not authenticated', fakeAsync(() => {
    spyOn(authService, 'getIsAuthenticatedListener').and.returnValue(Promise.resolve(of({ isLoggedIn: false, email: '', userId: '' })));
    spyOn(router, 'navigate');

    component.ngOnInit();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  }));
});
