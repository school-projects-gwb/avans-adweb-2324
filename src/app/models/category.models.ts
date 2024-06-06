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
  targetDate: Date;
  totalAmount?: number;

  constructor(
    id: string,
    bookletId: string,
    name: string,
    budget: number,
    targetDate: Date,
    totalAmount?: number
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
    if (!data) return new Category('', '', '', 0, new Date());
    return new Category(
      snapshot.id,
      data['bookletId'],
      data['name'],
      data['budget'],
      data['targetDate'] instanceof Timestamp
        ? data['targetDate'].toDate()
        : new Date(data['targetDate'])
    );
  },
};
