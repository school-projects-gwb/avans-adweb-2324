import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Category } from '../models/category.models';
import { categoryConverter } from '../models/firestore-converters/category.converter';
import { AuthService, CurrentUserResult } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async createCategory(category: Category): Promise<Category> {
    const ref = await addDoc(
      collection(this.firestore, 'categories'),
      categoryConverter.toFirestore(category)
    );
    category.id = ref.id;
    return category;
  }

  async updateCategory(category: Category): Promise<void> {
    const ref = doc(this.firestore, 'categories', category.id);
    const convertedCategory = categoryConverter.toFirestore(category);
    await updateDoc(ref, {
      name: convertedCategory.name,
      budget: convertedCategory.budget,
      targetDate: convertedCategory.targetDate,
    });
  }

  getCategoriesListener(bookletId: string): Observable<Category[]> {
    if (!bookletId) return new Observable<Category[]>();

    return new Observable<Category[]>((observer) => {
      const categoriesQuery = query(
        collection(this.firestore, 'categories'),
        where('bookletId', '==', bookletId)
      );

      const unsubscribeCategories = onSnapshot(
        categoriesQuery,
        (categoriesSnapshot) => {
          const categories: Category[] = [];
          const expensePromises: Promise<ExpenseSum>[] = [];

          categoriesSnapshot.forEach((doc) => {
            const category = categoryConverter.fromFirestore(doc, {});
            categories.push(category);

            const expensesQuery = query(
              collection(this.firestore, 'expenses'),
              where('categoryId', '==', doc.id),
              where('bookletId', '==', bookletId)
            );

            onSnapshot(expensesQuery, (expensesSnapshot) => {
              const totalAmount = expensesSnapshot.docs.reduce(
                (sum, expenseDoc) => {
                  const expenseData = expenseDoc.data();
                  const formattedAmount = expenseData['isIncome']
                    ? expenseData['amount']
                    : -expenseData['amount'];
                  return sum + formattedAmount;
                },
                0
              );
              category.totalAmount = Math.round(totalAmount * 100) / 100;
              observer.next(categories);
            });
          });

          Promise.all(expensePromises).then(() => {
            observer.next(categories);
          });
        },
        (error) => {
          console.error('Error getting categories:', error);
          observer.error(error);
        }
      );

      return () => unsubscribeCategories();
    });
  }

  getCombinedUserAndCategories(
    bookletId: string
  ): Observable<{
    currentUserResult: CurrentUserResult;
    categories: Category[];
  }> {
    return from(this.authService.getIsAuthenticatedListener()).pipe(
      switchMap((authObservable) =>
        authObservable.pipe(
          switchMap((currentUserResult) => {
            return this.getCategoriesListener(bookletId).pipe(
              map((categories) => ({ currentUserResult, categories }))
            );
          })
        )
      ),
      catchError((error) => {
        console.error('Error in getCombinedUserAndCategories:', error);
        throw error;
      })
    );
  }

  async deleteCategory(category: Category): Promise<void> {
    const ref = doc(this.firestore, 'categories', category.id);
    await deleteDoc(ref);
  }
}

interface ExpenseSum {
  categoryId: string;
  totalAmount: number;
}
