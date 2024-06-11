import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookletCreateDialogComponent, BookletDialogData } from './booklet-create-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BookletCreateDialogComponent', () => {
  let component: BookletCreateDialogComponent;
  let fixture: ComponentFixture<BookletCreateDialogComponent>;
  let dialogRef: MatDialogRef<BookletCreateDialogComponent>;

  beforeEach(async () => {
    const mockDialogData: BookletDialogData = {
      booklet: {
        name: 'Test Booklet',
        description: 'Test Description'
      },
      enableDelete: false,
      userEmailToModifyAccess: ''
    };

    const mockDialogRef = {
      close: jasmine.createSpy('close')
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        BookletCreateDialogComponent,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookletCreateDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with provided data', () => {
    expect(component.basicInfoFormGroup.controls['name'].value).toBe('Test Booklet');
    expect(component.basicInfoFormGroup.controls['description'].value).toBe('Test Description');
  });

  it('should not close the dialog when form is invalid on save', () => {
    component.basicInfoFormGroup.controls['name'].setValue('');
    component.save();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close the dialog with form data when form is valid on save', () => {
    component.save();
    expect(dialogRef.close).toHaveBeenCalledWith({
      booklet: {
        name: 'Test Booklet',
        description: 'Test Description'
      }
    });
  });

  it('should close the dialog on cancel', () => {
    component.cancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should add user email to booklet', () => {
    const mockBooklet = { addAuthenticatedUserEmail: jasmine.createSpy('addAuthenticatedUserEmail') };
    component.data.booklet = mockBooklet;
    component.addAuthenticatedUserEmail('test@example.com');
    expect(mockBooklet.addAuthenticatedUserEmail).toHaveBeenCalledWith('test@example.com');
    expect(component.userAccessFormGroup.controls['userEmailToModifyAccess'].value).toBeNull();
  });

  it('should remove user email from booklet', () => {
    const mockBooklet = { removeAuthenticatedUserEmail: jasmine.createSpy('removeAuthenticatedUserEmail') };
    component.data.booklet = mockBooklet;
    component.removeAuthenticatedUserEmail('test@example.com');
    expect(mockBooklet.removeAuthenticatedUserEmail).toHaveBeenCalledWith('test@example.com');
  });
});
