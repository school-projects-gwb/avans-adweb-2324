import { DocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';

export class Expense {
    id: string;
    bookletId: string;
    amount: number;
    date: Date;
  
    constructor(id: string, bookletId: string, amount: number, date: Date) {
      this.id = id;
      this.bookletId = bookletId; 
      this.amount = amount;
      this.date = date;
    }
  }

export const expenseConverter = {
  toFirestore: (expense: Expense) => {
    return {
      bookletId: expense.bookletId,
      amount: expense.amount,
      date: expense.date,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    if (!data) return new Expense('', '', 0, new Date());
    return new Expense(
      snapshot.id,
      data['bookletId'],
      data['amount'],
      data['date'] instanceof Date ? data['date'] : new Date(data['date'])
    );
  },
};
