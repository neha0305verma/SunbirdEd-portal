import { TestBed } from '@angular/core/testing';

import { BatchDetailsPushNotificationService } from './batch-details-push-notification.service';

describe('BatchDetailsPushNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BatchDetailsPushNotificationService = TestBed.get(BatchDetailsPushNotificationService);
    expect(service).toBeTruthy();
  });
});
