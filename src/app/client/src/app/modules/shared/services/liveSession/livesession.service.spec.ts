import { TestBed } from '@angular/core/testing';

import { LivesessionService } from './livesession.service';

describe('LivesessionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LivesessionService = TestBed.get(LivesessionService);
    expect(service).toBeTruthy();
  });
});
