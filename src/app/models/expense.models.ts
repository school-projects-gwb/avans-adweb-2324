import { DocumentSnapshot, SnapshotOptions, Timestamp } from '@angular/fire/firestore';

export class Expense {
    id: string;
    bookletId: string;
    amount: number;
    date: Date;
    name: string;
    isIncome: boolean;
  
    constructor(id: string, bookletId: string, amount: number, date: Date, name: string, isIncome: boolean) {
      this.id = id;
      this.bookletId = bookletId; 
      this.amount = amount;
      this.date = date;
      this.name = name;
      this.isIncome = isIncome;
    }
  }

export const expenseConverter = {
  toFirestore: (expense: Expense) => {
    return {
      bookletId: expense.bookletId,
      amount: expense.amount,
      date: expense.date,
      name: expense.name,
      isIncome: expense.isIncome,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    if (!data) return new Expense('', '', 0, new Date(), '', false);
    return new Expense(
      snapshot.id,
      data['bookletId'],
      data['amount'],
      data['date'] instanceof Timestamp ? data['date'].toDate() : new Date(data['date']),
      data['name'],
      data['isIncome']
    );
  },
};
