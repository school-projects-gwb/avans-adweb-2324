export class Expense {
  id: string;
  bookletId: string;
  amount: number;
  date: Date;
  name: string;
  isIncome: boolean;
  categoryId: string;
  categoryName?: string;

  constructor(
    id: string,
    bookletId: string,
    amount: number,
    date: Date,
    name: string,
    isIncome: boolean,
    categoryId: string
  ) {
    this.id = id;
    this.bookletId = bookletId;
    this.amount = amount;
    this.date = date;
    this.name = name;
    this.isIncome = isIncome;
    this.categoryId = categoryId;
  }
}
