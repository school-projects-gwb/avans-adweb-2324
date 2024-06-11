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
import { Observable } from 'rxjs';
import { Category, categoryConverter } from '../models/category.models';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private firestore: Firestore) {}

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

  async getCategoriesListener(bookletId: string): Promise<Observable<Category[]>> {
    console.log('Getting categories for booklet ID:', bookletId);
    return new Observable<Category[]>((observer) => {
      const categoriesQuery = query(
        collection(this.firestore, 'categories'),
        where('bookletId', '==', bookletId)
      );
  
      const unsubscribeCategories = onSnapshot(
        categoriesQuery,
        async (categoriesSnapshot) => {
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
  
            onSnapshot(
              expensesQuery,
              (expensesSnapshot) => {
                const totalAmount = expensesSnapshot.docs.reduce((sum, expenseDoc) => {
                  const expenseData = expenseDoc.data();
                  const formattedAmount = expenseData['isIncome'] ? expenseData['amount'] : -expenseData['amount'];
                  return sum + formattedAmount;
                }, 0);
                category.totalAmount = Math.round(totalAmount * 100) / 100;
                observer.next(categories);
              },
              (error) => {
                console.error('Error getting expenses for category:', error);
              }
            );
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
  
      return () => {
        unsubscribeCategories();
      };
    });
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
