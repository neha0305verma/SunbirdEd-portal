import { Routes, RouterModule } from '@angular/router';
import { NgModule, OnInit } from '@angular/core';
import { PushNotificationComponent } from './components';

const routes: Routes = [
    { path: 'course/:courseId/pushnotification', component: PushNotificationComponent },
    { path: 'workspace/content/pushnotification', component: PushNotificationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PushNotificationRoutingModule {

 }
