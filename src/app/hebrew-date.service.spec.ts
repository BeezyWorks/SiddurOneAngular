/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';
import { HebrewDateService } from './hebrew-date.service';

describe('HebrewDateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HebrewDateService]
    });
  });

  it('should ...', inject([HebrewDateService], (service: HebrewDateService) => {
    expect(service).toBeTruthy();
  }));
});
