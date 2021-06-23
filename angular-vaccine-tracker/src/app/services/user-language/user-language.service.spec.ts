import { TestBed } from '@angular/core/testing';

import { UserLanguageService } from './user-language.service';

describe('UserLanguageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserLanguageService = TestBed.get(UserLanguageService);
    expect(service).toBeTruthy();
  });
});
