import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookletCreateDialogComponent } from './booklet-create-dialog.component';

describe('BookletCreateDialogComponent', () => {
  let component: BookletCreateDialogComponent;
  let fixture: ComponentFixture<BookletCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookletCreateDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookletCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
