import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookletOverviewComponent } from './components/booklet-overview/booklet-overview.component';
import { BookletCreateDialogComponent } from './components/booklet-create-dialog/booklet-create-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BookletOverviewComponent, BookletCreateDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'huishoudboekje';
}
