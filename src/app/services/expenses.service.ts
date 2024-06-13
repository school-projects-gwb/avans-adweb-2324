import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Expense } from '../models/expense.models';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { expenseConverter } from '../models/firestore-converters/expense.converter';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private expenseConfigDataSource = new BehaviorSubject<ExpenseConfigData | null>(null);
  expenseConfigData = this.expenseConfigDataSource.asObservable();

  private isAuthenticatedSource = new BehaviorSubject<boolean>(true);
  isAuthenticated$ = this.isAuthenticatedSource.asObservable();

  constructor(private firestore: Firestore, private authService: AuthService) {}

  updateExpenseConfigData(data: ExpenseConfigData) {
    this.expenseConfigDataSource.next(data);
  }

  updateAuthenticationStatus(status: boolean) {
    this.isAuthenticatedSource.next(status);
  }

  getCombinedData(): Observable<{ data: ExpenseConfigData | null, isAuthenticated: boolean }> {
    return combineLatest([this.expenseConfigData, this.isAuthenticated$]).pipe(
      map(([data, isAuthenticated]) => ({ data, isAuthenticated }))
    );
  }

  getExpenseConfigData(): ExpenseConfigData | null {
    return this.expenseConfigDataSource.value;
  }

  private async validateBookletOwnership(bookletId: string): Promise<void> {
    const bookletRef = doc(this.firestore, `booklets/${bookletId}`);

    const bookletSnap = await getDoc(bookletRef);
    if (!bookletSnap.exists()) {
      console.error('Booklet not found:', bookletId);
      throw new Error('Booklet not found');
    }
    const bookletData = bookletSnap.data();
    console.log('Booklet data:', bookletData);

    const currentUser = await this.authService.getAuthenticatedUserId();
    console.log('Current user:', currentUser);

    if (bookletData['userId'] !== currentUser) {
      console.error('User not authorized:', currentUser);
      throw new Error('User not authorized');
    }
  }

  async createExpense(expense: Expense): Promise<Expense> {
    console.log('Creating expense:', expense);
    try {
      await this.validateBookletOwnership(expense.bookletId);

      const ref = await addDoc(
        collection(this.firestore, 'expenses'),
        expenseConverter.toFirestore(expense)
      );

      expense.id = ref.id;
      console.log('Expense created successfully with ID:', expense.id);
      return expense;
    } catch (error) {
      console.error('Error creating expense:', error);
      console.log('Error details:', error);
      throw error;
    }
  }

  async getExpensesListener(
    bookletId: string,
    month: number,
    year: number
  ): Promise<Observable<Expense[]>> {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    return new Observable<Expense[]>((observer) => {
      const q = query(
        collection(this.firestore, 'expenses'),
        where('bookletId', '==', bookletId),
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const expenses: Expense[] = [];

          querySnapshot.forEach((doc) => {
            expenses.push(expenseConverter.fromFirestore(doc, {}));
          });

          observer.next(expenses);
        },
        (error) => {
          console.error('Error getting expenses:', error);
          console.log('Error details:', error);
          observer.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  async deleteExpense(expenseId: string): Promise<void> {
    const ref = doc(this.firestore, 'expenses', expenseId);
    await deleteDoc(ref);
  }

  async updateExpense(expense: Expense): Promise<void> {
    const ref = doc(this.firestore, 'expenses', expense.id);
    await updateDoc(ref, { ...expense });
  }
}

export interface ExpenseConfigData {
  bookletId: string;
  month: number;
  year: number;
}
