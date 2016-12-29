/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserPrefsService } from './user-prefs.service';

describe('UserPrefsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserPrefsService]
    });
  });

  it('should ...', inject([UserPrefsService], (service: UserPrefsService) => {
    expect(service).toBeTruthy();
  }));
});
