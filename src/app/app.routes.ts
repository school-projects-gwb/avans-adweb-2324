import { Routes } from '@angular/router';
import { BookletOverviewComponent } from './booklet-overview/booklet-overview.component';
import { BookletDetailComponent } from './booklet-detail/booklet-detail.component'; 

export const routes: Routes = [
  // Route for the booklet overview page
  { path: 'booklets', component: BookletOverviewComponent },
  // Route for the booklet detail page, accessed by booklet ID
  { path: 'booklets/:id', component: BookletDetailComponent },
  // Add more routes as needed
];
