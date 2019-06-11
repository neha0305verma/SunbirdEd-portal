import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { WorkSpaceService, EditorService , BatchService, ReviewCommentsService} from './services';
import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
  ReviewSubmissionsComponent, PublishedComponent, UploadedComponent,
  CollectionEditorComponent, ContentEditorComponent, GenericEditorComponent,
  WorkspacesidebarComponent, DataDrivenComponent, DefaultTemplateComponent,
  FlaggedComponent, UpForReviewComponent, UpforReviewFilterComponent,
  BatchListComponent, BatchCardComponent, UpdateBatchComponent,
  UpforreviewContentplayerComponent, FlagConentplayerComponent, ReviewsubmissionsContentplayerComponent,
  PublishedPopupComponent, RequestChangesPopupComponent, LimitedPublishedComponent,
  AllContentComponent, FlagReviewerComponent, AllMyContentFilterComponent, CollaboratingOnComponent,
  CollaborationContentFilterComponent, CreateBatchComponent
} from './components';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import { ReviewCommentsComponent } from './components/review-comments/review-comments.component';
import { OrderModule } from 'ngx-order-pipe';
import { AdduserComponent } from './components/adduser/adduser.component';
import { OrgManagementModule } from '@sunbird/org-management';
import { ViewuserComponent } from './components/viewuser/viewuser.component';
import { PublicModule} from '@sunbird/public';
import { LearnModule } from '@sunbird/learn';

@NgModule({
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    SharedModule,
    SuiModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule,
    NgInviewModule,
    TelemetryModule,
    OrderModule,
    OrgManagementModule,
    PublicModule,
    LearnModule,
  ],
  declarations: [WorkspaceComponent, WorkspacesidebarComponent,
    CreateContentComponent, DraftComponent, ReviewSubmissionsComponent,
    PublishedComponent, UploadedComponent, CollectionEditorComponent,
    ContentEditorComponent, GenericEditorComponent, UpForReviewComponent, UpforReviewFilterComponent,
    DataDrivenComponent, UpForReviewComponent, UpforReviewFilterComponent, DefaultTemplateComponent,
    FlaggedComponent, BatchListComponent, BatchCardComponent, UpdateBatchComponent, UpforreviewContentplayerComponent,
    FlagConentplayerComponent,
    ReviewsubmissionsContentplayerComponent,
    PublishedPopupComponent,
    RequestChangesPopupComponent,
    LimitedPublishedComponent,
    AllContentComponent,
    FlagReviewerComponent,
    AllMyContentFilterComponent,
    CollaboratingOnComponent,
    CollaborationContentFilterComponent,
    ReviewCommentsComponent,
    CollaborationContentFilterComponent,
    AdduserComponent,
    ViewuserComponent,
    CreateBatchComponent
  ],
  providers: [WorkSpaceService, EditorService, BatchService, ReviewCommentsService],
  entryComponents: [CreateBatchComponent]
})
export class WorkspaceModule { }
