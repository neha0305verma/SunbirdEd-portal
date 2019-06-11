import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of as observableOf, throwError as observableThrowError, Observable } from 'rxjs';
import { ServerResponse, RequestParam, HttpOptions } from '@sunbird/shared';
import { mergeMap } from 'rxjs/operators';
import { StudentDetails } from '../../interfaces';
import { SharedDataPushNotificationService } from '../shared-data-push-notification/shared-data-push-notification.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationSendService {
  response;
  Root_URL = 'https://fcm.googleapis.com/fcm/send';
  notificationdata: any;

  constructor(private http: HttpClient, public sharedData: SharedDataPushNotificationService) { }

   public sendNotification(message): Observable<ServerResponse | string> {
    const httpOptions: HttpOptions = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'key=AAAAIIOjC0E:APA91bFhff-fY7balxzGi9QIKtioDPR8YBIlpeZpEBCW6vMZF3XXo-L8ffVQIbHDGtNHHcmNqVWt4iIPd4TMSHZm8yiLVUCtsd2JsnVmZueBesV_prXivrlHENcWgSZsCJWyCkfssbLg'})
    };
    this.notificationdata = this.sharedData.getTotalSelectedStudent();
    if (this.notificationdata.length > 0) {
      const notifytokens = this.notificationdata.map((student: StudentDetails) => {
        return student.token;
      });
      const body = {
        'notification': {
          'title': 'Ionic Notification - 3 hello Rajesh',
          'body': message,
          'sound': 'default',
          'icon': 'notification_icon'
        },
        'data': {
          'key': 'value'
        },
          'registration_ids': notifytokens,
          'priority': 'high'
      };
      return this.http.post(this.Root_URL, body, httpOptions).pipe(
        mergeMap((data: ServerResponse) => {
          console.log('data', data);
          return observableOf(data);
        }));
    } else {
      return observableOf('false');
    }
    }

}
