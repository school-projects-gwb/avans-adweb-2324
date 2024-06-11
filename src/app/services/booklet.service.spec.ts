import { TestBed } from '@angular/core/testing';
import { BookletService } from './booklet.service';
import { Firestore, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../../environments/environment';

class MockFirestore {}

describe('BookletService', () => {
  let service: BookletService;

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

    service = TestBed.inject(BookletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
