import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import User from '../models/user.models';
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { FirebaseError } from '@angular/fire/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth!: Auth;
  isUserLoggedIn!: boolean;
  loggedInUserId!: string;

  constructor(private firestore: Firestore) {
    this.auth = getAuth(this.firestore.app);
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isUserLoggedIn = true;
      } else {
        this.isUserLoggedIn = false;
      }
    });
  }

  getAuthenticatedUserId(): string {
    return this.loggedInUserId;
  }

  async getIsAuthenticatedListener(): Promise<Observable<CurrentUserResult>> {
    return new Observable<CurrentUserResult>((observer) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        const result = new CurrentUserResult();
        if (user) {
          result.isLoggedIn = true;
          result.userId = user.uid;
          this.loggedInUserId = result.userId;
          observer.next(result);
        } else {
          observer.next(result);
        }
      });

      return () => unsubscribe();
    });
  }

  async login(user: User): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        user.email,
        user.password
      );

      return new AuthResult(true, userCredential);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      return new AuthResult(
        false,
        AuthResult.getFormattedError(firebaseError.code, firebaseError.message)
      );
    }
  }

  async register(user: User): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        user.email,
        user.password
      );

      return new AuthResult(true, userCredential);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      return new AuthResult(
        false,
        AuthResult.getFormattedError(firebaseError.code, firebaseError.message)
      );
    }
  }
}

export class CurrentUserResult {
  isLoggedIn: boolean = false;
  userId!: string;
}

export class AuthResult {
  isSuccess: boolean;
  payload: UserCredential | string;

  constructor(isSuccess: boolean, payload: UserCredential | string) {
    this.isSuccess = isSuccess;
    this.payload = payload;
  }

  static getFormattedError(errorCode: unknown, errorMessage: unknown): string {
    return `[${errorCode}]: ${errorMessage}`;
  }

  getErrorMessage(): string {
    if (this.isSuccess) return '';
    const stringPayload: string = this.payload.toString();
    let result: string = stringPayload;

    if (stringPayload.includes('weak-password'))
      result = 'Je wachtwoord moet minimaal 6 tekens bevatten!';

    if (stringPayload.includes('invalid-credential'))
      result =
        'De combinatie van e-mailadres en wachtwoord is niet bekend in ons systeem.';

    if (stringPayload.includes('email-already-in-use'))
      result = 'Dit e-mailadres is al bij ons bekend.';

    return result;
  }
}
