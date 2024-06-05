import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-logged-in-user',
  standalone: true,
  imports: [NgIf, RouterModule],
  templateUrl: './logged-in-user.component.html',
  styleUrl: './logged-in-user.component.css',
})
export class LoggedInUserComponent implements OnInit {
  currentUserSubscription: Subscription = new Subscription();
  userEmail!: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getIsAuthenticatedListener().then((observable) => {
      this.currentUserSubscription = observable.subscribe(
        (currentUserResult) => {
          if (!currentUserResult.isLoggedIn) this.router.navigate(['/auth']);
          this.userEmail = currentUserResult.email;
        }
      );
    });
  }

  async logout(): Promise<void> {
    if (await this.authService.logout()) this.router.navigate(['/auth']);
  }
}
