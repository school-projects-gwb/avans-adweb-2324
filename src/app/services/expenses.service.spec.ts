import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Booklet, bookletConverter } from '../models/booklet.models';
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
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BookletService {
  private booklets: Booklet[] = [];

  constructor(private firestore: Firestore, private authService: AuthService) {}

  async createBooklet(booklet: Booklet): Promise<Booklet> {
    const ref = await addDoc(
      collection(this.firestore, 'booklets'),
      bookletConverter.toFirestore(booklet)
    );

    booklet.id = ref.id;
    return booklet;
  }

  async updateBooklet(booklet: Booklet): Promise<void> {
    const ref = doc(this.firestore, 'booklets', booklet.id);
    await updateDoc(ref, {
      name: booklet.name,
      description: booklet.description,
    });
  }

  async getBookletListener(userId: string): Promise<Observable<Booklet[]>> {
    return new Observable<Booklet[]>((observer) => {
      const q = query(
        collection(this.firestore, 'booklets'),
        where('isArchived', '==', false),
        where('userId', '==', userId)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const booklets: Booklet[] = [];

        querySnapshot.forEach((doc) => {
          booklets.push(bookletConverter.fromFirestore(doc, {}));
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

  // Fetches a single booklet by id - currently returns mock data
  getBooklet(id: number): Observable<Booklet> {
    console.log(`Fetching booklet with id: ${id}`);
    const booklet = this.booklets.find((b) => b.id === id.toString());
    if (!booklet) {
      console.error(`Booklet with id ${id} not found`);
      throw new Error(`Booklet with id ${id} not found`);
    }
    return of(booklet);
  }
}