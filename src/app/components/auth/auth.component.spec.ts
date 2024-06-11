/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { Firestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockAuthService {
  login(user: unknown) {
    return Promise.resolve({ isSuccess: true, getErrorMessage: () => '' });
  }

  register(user: unknown) {
    return Promise.resolve({ isSuccess: true, getErrorMessage: () => '' });
  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockFirestore {}

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatRadioModule,
        MatInputModule,
        BrowserAnimationsModule,
        AuthComponent
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        { provide: Firestore, useClass: MockFirestore },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.formGroup).toBeDefined();
    expect(component.formGroup.controls['email'].value).toBeNull();
    expect(component.formGroup.controls['password'].value).toBeNull();
    expect(component.isLogin).toBeTrue();
  });

  it('should invalidate form when email is incorrect', () => {
    component.formGroup.controls['email'].setValue('invalidemail');
    component.formGroup.controls['password'].setValue('password');
    expect(component.formGroup.invalid).toBeTrue();
  });

  it('should validate form when inputs are correct', () => {
    component.formGroup.controls['email'].setValue('test@example.com');
    component.formGroup.controls['password'].setValue('password');
    expect(component.formGroup.valid).toBeTrue();
  });

  it('should login on form submit when isLogin is true', fakeAsync(() => {
    component.isLogin = true;
    component.formGroup.controls['email'].setValue('test@example.com');
    component.formGroup.controls['password'].setValue('password');

    const userObject = {
      email: 'test@example.com',
      password: 'password',
    };

    component.onSubmit(userObject);
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should register on form submit when isLogin is false', fakeAsync(() => {
    component.isLogin = false;
    component.formGroup.controls['email'].setValue('test@example.com');
    component.formGroup.controls['password'].setValue('password');

    const userObject = {
      email: 'test@example.com',
      password: 'password',
    };

    component.onSubmit(userObject);
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should change mode on radio button change', () => {
    const radioChangeEvent = { value: 1 } as unknown as MatRadioChange;
    component.onChange(radioChangeEvent);
    expect(component.isLogin).toBeFalse();

    radioChangeEvent.value = 0;
    component.onChange(radioChangeEvent);
    expect(component.isLogin).toBeTrue();
  });
});
