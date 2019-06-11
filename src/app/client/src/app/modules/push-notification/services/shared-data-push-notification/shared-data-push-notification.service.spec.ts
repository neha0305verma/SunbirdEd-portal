import { TestBed } from '@angular/core/testing';

import { SharedDataPushNotificationService } from './shared-data-push-notification.service';

describe('SharedDataPushNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedDataPushNotificationService = TestBed.get(SharedDataPushNotificationService);
    expect(service).toBeTruthy();
  });
});
