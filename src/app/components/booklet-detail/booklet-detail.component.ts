import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookletService } from '../../services/booklet.service'; 
import { Booklet } from '../../models/booklet.models'; 

@Component({
  selector: 'app-booklet-detail',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './booklet-detail.component.html',
  styleUrls: ['./booklet-detail.component.css'] 
})
export class BookletDetailComponent implements OnInit {
  booklet?: Booklet; 

  constructor(
    private route: ActivatedRoute,
    private bookletService: BookletService
  ) { }

  ngOnInit() {
    this.getBooklet();
  }

  getBooklet(): void {
    // Convert the route parameter 'id' to a number with the '+' operator
    const id = +(this.route.snapshot.paramMap.get('id') ?? 0);    
    this.bookletService.getBooklet(id)
      .subscribe(booklet => {
        this.booklet = booklet;
        console.log(`Booklet with id ${id} fetched successfully`);
      }, error => {
        console.error(`Error fetching booklet with id ${id}:`, error); 
        // Suggestion: Implement user-friendly error handling here, e.g., display a message in the UI
      });
  }

  editBooklet(): void {
    // TODO: Implement edit functionality
    console.log('Edit booklet:', this.booklet);
  }
}