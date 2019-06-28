import { TestBed } from '@angular/core/testing';

import { CourseDetailsPushNotificationService } from './course-details-push-notification.service';

describe('CourseDetailsPushNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CourseDetailsPushNotificationService = TestBed.get(CourseDetailsPushNotificationService);
    expect(service).toBeTruthy();
  });
});
