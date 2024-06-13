import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import User from '../../models/user.models';
import { Firestore } from '@angular/fire/firestore';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatInputModule, MatRadioModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  formGroup!: FormGroup;
  isLogin: boolean;
  firestore = inject(Firestore);
  errorMessage!: string;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.isLogin = true;
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });

    this.formGroup.value;
  }

  async onSubmit(userObject: User) {
    if (this.isLogin) {
      const result = await this.authService.login(userObject);
      if (result.isSuccess) this.router.navigate(['/']);
      this.errorMessage = result.getErrorMessage();
    } else {
      const result = await this.authService.register(userObject);
      if ((await result).isSuccess) this.router.navigate(['/']);
      this.errorMessage = result.getErrorMessage();
    }
  }

  onChange(event: MatRadioChange) {
    this.isLogin = event.value == 0;
  }
}
