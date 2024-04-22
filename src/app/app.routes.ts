import { Routes } from '@angular/router';
import { BookletOverviewComponent } from './booklet-overview/booklet-overview.component';
import { BookletDetailComponent } from './booklet-detail/booklet-detail.component'; 

export const routes: Routes = [
  { path: '', component: BookletOverviewComponent },
  { path: 'booklets/:id', component: BookletDetailComponent },
];
