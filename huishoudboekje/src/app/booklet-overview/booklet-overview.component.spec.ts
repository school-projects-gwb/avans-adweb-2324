import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookletOverviewComponent } from './booklet-overview.component';

describe('BookletOverviewComponent', () => {
  let component: BookletOverviewComponent;
  let fixture: ComponentFixture<BookletOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookletOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookletOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
