import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { Firestore, collection, query, where, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-expenses-income',
  templateUrl: './expenses-income.component.html',
  styleUrls: ['./expenses-income.component.css']
})
export class ExpensesIncomeComponent implements OnInit {
  @Input() bookletId!: string;  
  expenses: Expense[] = [];  

  constructor(private firestore: Firestore, private route: ActivatedRoute) { }  

  ngOnInit(): void {
    const bookletId = this.route.snapshot.paramMap.get('id');  
    const expensesRef = collection(this.firestore, 'expenses');
    const q = query(expensesRef, where("bookletId", "==", bookletId)); 

    onSnapshot(q, (snapshot) => {
      this.expenses = snapshot.docs.map(doc => ({
        id: doc.id,
        date: doc.data()['date'].toDate(),
        amount: doc.data()['amount'],
        bookletId: doc.data()['bookletId']
      }));
    });
  }
}

export interface Expense {
  date: Date;
  amount: number;
  bookletId: string;
}