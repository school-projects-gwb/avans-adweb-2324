import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { of } from 'rxjs';

class MockFirestore {}

const mockAngularFireAuth: unknown = {
  auth: jasmine.createSpyObj('auth', {
    signInWithEmailAndPassword: Promise.resolve(),
    signOut: Promise.resolve(),
  }),
  authState: of(null),
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: Firestore, useClass: MockFirestore },
        { provide: Auth, useValue: mockAngularFireAuth },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'huishoudboekje' title`, () => {
    expect(component.title).toEqual('huishoudboekje');
  });
});
