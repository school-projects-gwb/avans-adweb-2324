/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesIncomeComponent } from './expenses-income.component';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Auth } from '@angular/fire/auth';

class MockFirestore {}

const mockAngularFireAuth: any = {
  auth: jasmine.createSpyObj('auth', {
    signInWithEmailAndPassword: Promise.resolve(),
    signOut: Promise.resolve(),
  }),
  authState: of(null)
};

describe('ExpensesIncomeComponent', () => {
  let component: ExpensesIncomeComponent;
  let fixture: ComponentFixture<ExpensesIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesIncomeComponent],
      providers: [
        { provide: Firestore, useClass: MockFirestore },
        { provide: Auth, useValue: mockAngularFireAuth },
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

    fixture = TestBed.createComponent(ExpensesIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
