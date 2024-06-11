import { TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { importProvidersFrom } from '@angular/core';
import { environment } from '../../environments/environment';
import { Firestore, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ExpensesService } from './expenses.service';

class MockFirestore {}

describe('ExpensesService', () => {
  let service: ExpensesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: Firestore, useClass: MockFirestore },
        importProvidersFrom(provideFirestore(() => getFirestore())),
        importProvidersFrom(
          provideFirebaseApp(() =>
            initializeApp(environment.firebase)
          )
        ),
      ],
    }).compileComponents();

    service = TestBed.inject(ExpensesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
