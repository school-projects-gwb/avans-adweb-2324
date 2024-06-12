import { DocumentSnapshot, SnapshotOptions, Timestamp } from "@angular/fire/firestore";
import { Expense } from "../expense.models";

export const expenseConverter = {
    toFirestore: (expense: Expense) => {
      return {
        bookletId: expense.bookletId,
        amount: expense.amount,
        date: expense.date,
        name: expense.name,
        isIncome: expense.isIncome,
        categoryId: expense.categoryId,
      };
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
      const data = snapshot.data(options);
      if (!data) return new Expense('', '', 0, new Date(), '', false, '');
      return new Expense(
        snapshot.id,
        data['bookletId'],
        data['amount'],
        data['date'] instanceof Timestamp ? data['date'].toDate() : new Date(data['date']),
        data['name'],
        data['isIncome'],
        data['categoryId'],
      );
    },
  };