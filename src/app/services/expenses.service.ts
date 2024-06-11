import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense, expenseConverter } from '../models/expense.models';
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

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private expenses: Expense[] = [];

  constructor(private firestore: Firestore, private authService: AuthService) {}

  private async validateBookletOwnership(bookletId: string): Promise<void> {
    const bookletRef = doc(this.firestore, `booklets/${bookletId}`);
    
    const bookletSnap = await getDoc(bookletRef);
    if (!bookletSnap.exists()) {
      console.error('Booklet not found:', bookletId); // Log booklet not found
      throw new Error('Booklet not found');
    }
    const bookletData = bookletSnap.data();
    console.log('Booklet data:', bookletData); // Log booklet data

    const currentUser = await this.authService.getAuthenticatedUserId();
    console.log('Current user:', currentUser); // Log current user

    if (bookletData['userId'] !== currentUser) {
      console.error('User not authorized:', currentUser); // Log unauthorized user
      throw new Error('User not authorized');
    }
  }

  async createExpense(expense: Expense): Promise<Expense> {
    console.log('Creating expense:', expense); // Add debugging log
    try {
      await this.validateBookletOwnership(expense.bookletId);

      const ref = await addDoc(
        collection(this.firestore, 'expenses'),
        expenseConverter.toFirestore(expense)
      );

      expense.id = ref.id;
      console.log('Expense created successfully with ID:', expense.id); // Log success
      return expense;
    } catch (error) {
      console.error('Error creating expense:', error); // Add error handling
      console.log('Error details:', error); // Log error details
      throw error;
    }
  }

  async getExpensesListener(bookletId: string, month: number, year: number): Promise<Observable<Expense[]>> {
    console.log('Getting expenses for booklet ID:', bookletId); // Add debugging log
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    return new Observable<Expense[]>((observer) => {
      const q = query(
        collection(this.firestore, 'expenses'),
        where('bookletId', '==', bookletId),
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const expenses: Expense[] = [];

        querySnapshot.forEach((doc) => {
          expenses.push(expenseConverter.fromFirestore(doc, {}));
        });

        observer.next(expenses);
      }, (error) => {
        console.error('Error getting expenses:', error); // Add error handling
        console.log('Error details:', error); // Log error details
        observer.error(error);
      });

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
