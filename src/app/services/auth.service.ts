import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import User from '../models/user.models';
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { FirebaseError } from '@angular/fire/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth!: Auth;

  constructor(private firestore: Firestore) {
    this.auth = getAuth(this.firestore.app);
  }

  async login(user: User): Promise<UserCredential | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        user.email,
        user.password
      );

      return userCredential;
    } catch (error) {
      const firebaseError = error as FirebaseError;
      this.logError(firebaseError.code, firebaseError.message);
      return null;
    }
  }

  async register(user: User): Promise<UserCredential | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        user.email,
        user.password
      );

      return userCredential;
    } catch (error) {
      const firebaseError = error as FirebaseError;
      this.logError(firebaseError.code, firebaseError.message);
      return null;
    }
  }

  private logError(errorCode: unknown, errorMessage: unknown) {
    console.error(`[${errorCode}]: ${errorMessage}`);
  }
}
