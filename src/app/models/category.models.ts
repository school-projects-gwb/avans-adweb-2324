import {
  DocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from '@angular/fire/firestore';

export class Category {
  id: string;
  bookletId: string;
  name: string;
  budget: number;
  targetDate: Date | null;
  totalAmount: number;

  constructor(
    id: string,
    bookletId: string,
    name: string,
    budget: number,
    targetDate: Date | null = null,
    totalAmount: number = 0
  ) {
    this.id = id;
    this.bookletId = bookletId;
    this.name = name;
    this.budget = budget;
    this.targetDate = targetDate;
    this.totalAmount = totalAmount;
  }
}

export const categoryConverter = {
  toFirestore: (category: Category) => {
    return {
      bookletId: category.bookletId,
      name: category.name,
      budget: category.budget,
      targetDate: category.targetDate,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    if (!data) return new Category('', '', '', 0, null);
    const targetDate = data['targetDate'] instanceof Timestamp
      ? data['targetDate'].toDate()
      : data['targetDate']
        ? new Date(data['targetDate'])
        : null;
    return new Category(
      snapshot.id,
      data['bookletId'],
      data['name'],
      data['budget'],
      targetDate
    );
  },
};
