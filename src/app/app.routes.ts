import { Routes } from '@angular/router';
import { BookletOverviewComponent } from './components/booklet-overview/booklet-overview.component';
import { BookletDetailComponent } from './components/booklet-detail/booklet-detail.component'; 
import { AuthComponent } from './components/auth/auth.component';
import { ExpensesIncomeComponent } from './components/expenses-income/expenses-income.component';
import { BookletArchiveComponent } from './components/booklet-archive/booklet-archive.component';

export const routes: Routes = [
  { path: '', component: BookletOverviewComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'booklets/:id', component: BookletDetailComponent },
  { path: 'huishoudboekje/:id', component: ExpensesIncomeComponent },
  { path: 'archive', component: BookletArchiveComponent },
];
