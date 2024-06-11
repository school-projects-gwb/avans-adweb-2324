import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  onSnapshot,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category, categoryConverter } from '../models/category.models';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private firestore: Firestore) {}

  async getCategoriesListener(
    bookletId: string
  ): Promise<Observable<Category[]>> {
    console.log('Getting categories for booklet ID:', bookletId);
    return new Observable<Category[]>((observer) => {
      const q = query(
        collection(this.firestore, 'categories'),
        where('bookletId', '==', bookletId)
      );

      const unsubscribe = onSnapshot(
        q,
        async (querySnapshot) => {
          const categories: Category[] = [];
          const expensePromises: Promise<ExpenseSum>[] = [];

          querySnapshot.forEach((doc) => {
            const category = categoryConverter.fromFirestore(doc, {});
            categories.push(category);

            const expensesQuery = query(
              collection(this.firestore, 'expenses'),
              where('categoryId', '==', doc.id),
              where('bookletId', '==', bookletId)
            );
            const expensePromise = new Promise<ExpenseSum>((resolve) => {
              onSnapshot(expensesQuery, (expensesSnapshot) => {
                const totalAmount = expensesSnapshot.docs.reduce(
                  (sum, expenseDoc) => {
                    const expenseData = expenseDoc.data();
                    return sum + (expenseData['amount'] || 0);
                  },
                  0
                );
                resolve({ categoryId: doc.id, totalAmount });
              });
            });

            expensePromises.push(expensePromise);
          });

          const expenseSums = await Promise.all(expensePromises);

          categories.forEach((category) => {
            const expenseSum = expenseSums.find(
              (exp) => exp['categoryId'] === category.id
            );
            category.totalAmount = expenseSum ? expenseSum['totalAmount'] : 0;
          });

          observer.next(categories);
        },
        (error) => {
          console.error('Error getting categories:', error);
          observer.error(error);
        }
      );

      return () => unsubscribe();
    });
  }
}

interface ExpenseSum {
  categoryId: string;
  totalAmount: number;
}
