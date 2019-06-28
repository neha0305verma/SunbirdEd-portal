import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushNotificationRoutingModule } from './push-notification-routing.module';
import { BatchDetailsPushNotificationService, PushNotificationSendService, SharedDataPushNotificationService } from './services';
import { PushNotificationComponent } from './components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@sunbird/shared';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { GhostComponent } from './components/pushnotification/ghost/ghost.component';
import { Ghost2Component } from './components/pushnotification/ghost2/ghost2.component';
import { SlickModule } from 'ngx-slick';
import { SuiModule } from 'ng2-semantic-ui';

@NgModule({
  imports: [
    CommonModule,
    PushNotificationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    Ng2SearchPipeModule,
    SlickModule,
    SuiModule
  ],
  declarations: [
    PushNotificationComponent,
    GhostComponent,
    Ghost2Component
  ],
  providers: [
    BatchDetailsPushNotificationService,
    PushNotificationSendService,
    SharedDataPushNotificationService
  ]
})
export class PushNotificationModule {

 }
