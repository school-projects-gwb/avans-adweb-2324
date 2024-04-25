import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Booklet, bookletConverter } from '../models/booklet.models';
import {
  DocumentSnapshot,
  Firestore,
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class BookletService {
  private booklets: Booklet[] = [];

  constructor(private firestore: Firestore) {}

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

  async getBooklets(): Promise<Booklet[]> {
    const q = query(
      collection(this.firestore, 'booklets'),
      where('isArchived', '==', false)
    );

    const snapshot = await getDocs(q);

    const docs: Booklet[] = [];
    snapshot.forEach((doc: DocumentSnapshot) => {
      docs.push(bookletConverter.fromFirestore(doc, {}));
    });

    return docs;
  }

  async getBookletListener(): Promise<Observable<Booklet[]>> {
    return new Observable<Booklet[]>((observer) => {
      const q = query(
        collection(this.firestore, 'booklets'),
        where('isArchived', '==', false)
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