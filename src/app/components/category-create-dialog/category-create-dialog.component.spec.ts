import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CategoryCreateDialogComponent,
  CategoryDialogData,
} from './category-create-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CategoryCreateDialogComponent', () => {
  let component: CategoryCreateDialogComponent;
  let fixture: ComponentFixture<CategoryCreateDialogComponent>;
  let dialogRef: MatDialogRef<CategoryCreateDialogComponent>;

  beforeEach(async () => {
    const mockDialogData: CategoryDialogData = {
      category: {
        name: 'Test Category',
        budget: 100,
        targetDate: new Date('2024-06-11T06:45:04.000Z'),
      },
      enableDelete: false,
    };

    const mockDialogRef = {
      close: jasmine.createSpy('close'),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        CategoryCreateDialogComponent,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryCreateDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with provided data', () => {
    const formGroup = component.formGroup;

    expect(formGroup.controls['name'].value).toBe('Test Category');
    expect(formGroup.controls['budget'].value).toBe(100);

    const formDate = formGroup.controls['targetDate'].value;
    const providedDate = new Date('2024-06-11T06:45:04.000Z');

    expect(formDate.getTime()).toEqual(providedDate.getTime());
  });

  it('should not close the dialog when form is invalid on save', () => {
    component.formGroup.controls['name'].setValue('');
    component.save();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close the dialog with form data when form is valid on save', () => {
    component.save();
    expect(dialogRef.close).toHaveBeenCalledWith({
      category: {
        name: 'Test Category',
        budget: 100,
        targetDate: new Date('2024-06-11T06:45:04.000Z'),
      },
    });
  });

  it('should close the dialog on cancel', () => {
    component.cancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
