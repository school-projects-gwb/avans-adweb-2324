import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, of } from 'rxjs';
import { Booklet } from '../models/booklet.models';

@Injectable({
  providedIn: 'root'
})
export class BookletService {
  private booklets: Booklet[] = []; // Placeholder for booklet data

  constructor(private http: HttpClient) { } // Inject HttpClient

  // Fetches all booklets - currently returns mock data
  getBooklets(): Observable<Booklet[]> {
    // TODO: Replace with actual API call
    // Example: this.http.get<Booklet[]>('api/booklets');
    console.log('Fetching all booklets');
    return of(this.booklets);
  }

  // Fetches a single booklet by id - currently returns mock data
  getBooklet(id: number): Observable<Booklet> {
    console.log(`Fetching booklet with id: ${id}`);
    const booklet = this.booklets.find(b => b.id === id);
    if (!booklet) {
      console.error(`Booklet with id ${id} not found`);
      throw new Error(`Booklet with id ${id} not found`);
    }
    return of(booklet);
  }

  // TODO: Implement other CRUD methods as needed
}
