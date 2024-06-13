import { TestBed } from '@angular/core/testing';
import { CategoriesService } from './categories.service';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { of } from 'rxjs';

class MockFirestore {}

const mockAngularFireAuth: unknown = {
  auth: jasmine.createSpyObj('auth', {
    signInWithEmailAndPassword: Promise.resolve(),
    signOut: Promise.resolve(),
  }),
  authState: of(null)
};

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: Firestore, useClass: MockFirestore },
        { provide: Auth, useValue: mockAngularFireAuth },
      ],
    }).compileComponents();

    service = TestBed.inject(CategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
