import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booklet } from '../models/booklet.models';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { CurrentUserResult } from './auth.service';
import { bookletConverter } from '../models/firestore-converters/booklet.converter';

@Injectable({
  providedIn: 'root',
})
export class BookletService {
  constructor(private firestore: Firestore) {}

  async createBooklet(
    booklet: Booklet,
    loggedInUserEmail: string
  ): Promise<Booklet> {
    booklet.ownerEmail = loggedInUserEmail;

    const ref = await addDoc(
      collection(this.firestore, 'booklets'),
      bookletConverter.toFirestore(booklet)
    );

    booklet.id = ref.id;
    return booklet;
  }

  async updateBooklet(booklet: Booklet): Promise<void> {
    const ref = doc(this.firestore, 'booklets', booklet.id);
    const convertedBooklet = bookletConverter.toFirestore(booklet);
    await updateDoc(ref, {
      name: convertedBooklet.name,
      description: convertedBooklet.description,
      authenticatedUserEmails: convertedBooklet.authenticatedUserEmails,
    });
  }

  async getBookletListener(
    currentUserResult: CurrentUserResult,
    archived: boolean = false
  ): Promise<Observable<Booklet[]>> {
    return new Observable<Booklet[]>((observer) => {
      const q = query(
        collection(this.firestore, 'booklets'),
        where('isArchived', '==', archived),
        where(
          'authenticatedUserEmails',
          'array-contains',
          currentUserResult.email
        )
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const booklets: Booklet[] = [];

        querySnapshot.forEach((doc) => {
          const booklet: Booklet = bookletConverter.fromFirestore(doc, {});
          booklet.setOwnerInfo(
            currentUserResult.userId,
            currentUserResult.email
          );
          booklets.push(booklet);
        });

        observer.next(booklets);
      });

      return () => unsubscribe();
    });
  }

  async archiveBooklet(booklet: Booklet): Promise<void> {
    const ref = doc(this.firestore, 'booklets', booklet.id);
    await updateDoc(ref, {
      isArchived: true,
    });
  }

  async unarchiveBooklet(booklet: Booklet): Promise<void> {
    const ref = doc(this.firestore, 'booklets', booklet.id);
    await updateDoc(ref, {
      isArchived: false,
    });
  }
}
