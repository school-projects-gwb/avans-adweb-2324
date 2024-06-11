import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookletArchiveComponent } from './booklet-archive.component';

describe('BookletArchiveComponent', () => {
  let component: BookletArchiveComponent;
  let fixture: ComponentFixture<BookletArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookletArchiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookletArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
