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
