import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookletOverviewComponent } from '../booklet-overview/booklet-overview.component';
import { LoggedInUserComponent } from '../logged-in-user/logged-in-user.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BookletOverviewComponent, LoggedInUserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'huishoudboekje';
}
