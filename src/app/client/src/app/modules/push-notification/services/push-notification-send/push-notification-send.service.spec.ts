import { TestBed } from '@angular/core/testing';

import { PushNotificationSendService } from './push-notification-send.service';

describe('PushNotificationSendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PushNotificationSendService = TestBed.get(PushNotificationSendService);
    expect(service).toBeTruthy();
  });
});
