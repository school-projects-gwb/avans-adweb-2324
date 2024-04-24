import { Routes } from '@angular/router';
import { BookletOverviewComponent } from './components/booklet-overview/booklet-overview.component';
import { BookletDetailComponent } from './components/booklet-detail/booklet-detail.component'; 

export const routes: Routes = [
  { path: '', component: BookletOverviewComponent },
  { path: 'booklets/:id', component: BookletDetailComponent },
];
