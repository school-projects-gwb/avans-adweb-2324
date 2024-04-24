import { TestBed } from '@angular/core/testing';

import { BookletService } from './booklet.service';

describe('BookletService', () => {
  let service: BookletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
