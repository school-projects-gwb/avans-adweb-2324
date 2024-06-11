import { TestBed } from '@angular/core/testing';

import { CategoriesService } from './categories.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { importProvidersFrom } from '@angular/core';
import { environment } from '../../environments/environment';
import { Firestore, getFirestore, provideFirestore } from '@angular/fire/firestore';

class MockFirestore {}

describe('CategoriesService', () => {
  let service: CategoriesService;

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

    service = TestBed.inject(CategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
