import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookletDetailComponent } from './booklet-detail.component';

describe('BookletDetailComponent', () => {
  let component: BookletDetailComponent;
  let fixture: ComponentFixture<BookletDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookletDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookletDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
