import { Component, OnInit } from '@angular/core';
import { BookletService } from '../../services/booklet.service'; 
import { Booklet } from '../../models/booklet.models';
import { RouterModule } from '@angular/router';
import { BOOKLETS } from '../../mock-data/mock-booklets';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-booklet-overview',
  standalone: true,
  imports: [RouterModule, NgFor],
  templateUrl: './booklet-overview.component.html',
  styleUrls: ['./booklet-overview.component.css']
})

export class BookletOverviewComponent implements OnInit {
  booklets: Booklet[] = [];

  constructor(private bookletService: BookletService) { } 

  ngOnInit(): void {
    this.getBooklets();
  }

  getBooklets(): void {
    this.bookletService.getBooklets()
      .subscribe(booklets => {
        this.booklets = BOOKLETS; 
        console.log('Fetched booklets:', booklets); 
        // TODO: Filter booklets based on logged-in user
        // Edge case: If no booklets are returned, consider displaying a message or redirecting the user
      }, error => {
        console.error('Error fetching booklets:', error); // Error handling and logging
        // Suggestion: Implement user-friendly error handling here, e.g., display a message in the UI
      });
  }
}