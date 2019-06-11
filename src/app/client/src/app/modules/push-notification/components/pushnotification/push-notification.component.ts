import { Component, OnInit } from '@angular/core';
import { BatchDetailsPushNotificationService, SharedDataPushNotificationService, PushNotificationSendService } from '../../services';
import * as $ from 'jquery';
import { BatchDetails, StudentDetails } from '../../interfaces';
import { HttpClient } from '@angular/common/http';
import { ServerResponse, ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { takeUntil, delay } from 'rxjs/operators';
import { CourseBatchService } from './../../../learn/services/index';
import * as _ from 'lodash';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  NgForm
} from '@angular/forms';
import { PermissionService, UserService, LearnerService, SearchParam} from '@sunbird/core';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger } from '@angular/animations';
import { fadeIn, fadeOut } from '../index';
import { concatMap } from 'rxjs/operators';
import { of as observableOf, combineLatest, Subject, Observable } from 'rxjs';
import 'rxjs/add/operator/mergeMap';
@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  // animations: [
  //   trigger('fadeOut', fadeOut()),
  //   trigger('fadeIn', fadeIn(':enter'))
  // ],
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent implements OnInit {
  courseId: string;
  courseMentor = false;
  studentData = [];
  searchText;
  batchData = [];
  count;
  countSelectedStudent;
  counttotalSelectedStudent;
  selectedStudentData;
  checkboxstatus;
  batch;
  myform: FormGroup;
  message: FormControl;
  nostudent;
  nothingSelected = false;
  selectedflag;
  batchList;
  ghosts = [];
  ghosts2 = [];
  batchStatus: Number;
  response;
  statusOptions = [
    { name: 'Ongoing', value: 1 },
    { name: 'Upcoming', value: 0 }
  ];
  userList = [];
  participantIds = [];
  mentorIds = [];
  enrolledBatchInfo: any;
  showBatchList = false;
  showError = false;
  userDetails: any;
  public unsubscribe = new Subject<void>();

  batchDetails: BatchDetails[];
  batchInstance: BatchDetails;
  studentList;
  formError;
  courseName;
  constructor(private fb: FormBuilder, private batchService: BatchDetailsPushNotificationService,
    private sharedData: SharedDataPushNotificationService,
    private sendService: PushNotificationSendService,
    public permissionService: PermissionService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    public userService: UserService,
    public toasterService: ToasterService,
    public resourceService: ResourceService,
    public configService: ConfigService,
    public courseBatchService: CourseBatchService,
    public learnerService: LearnerService) {
    this.batchStatus = this.statusOptions[0].value;

  }
  ngOnInit() {
    this.ghosts = [1, 2, 3, 4, 5, 6];
    this.ghosts2 = [1, 2, 3, 4];
    this.activatedRoute.paramMap.subscribe(params => {
      this.courseId = params.get('courseId');
    });
    this.myform = this.fb.group({
      message: ''
    });
    if (this.permissionService.checkRolesPermissions(['COURSE_MENTOR'])) {
      this.courseMentor = true;
    } else {
      this.courseMentor = false;
    }
    this.getAllBatchDetails(this.courseId, this.courseMentor);
   }

  getStudentInfo(batchId, batchName, courseName, event) {
    event.stopPropagation();

   this.fetchUserDetails(event, batchName, courseName, batchId);

    // else{
    //   this.nostudent="There is no enrollment present";
    // }
  }

  setBatchCheckbox(event, batchId, batchName, courseName) {

    event.stopPropagation();
    this.batchData = this.batchData.map(batch => {
      if (batch.batchId === batchId) {
        if (event.target.checked) {
          batch['checkbox'] = true;
        } else {
          batch['checkbox'] = false;
          batch['selectedStudent'] = 0;
        }
      }
      return batch;
    });
    this.getStudentInfo(batchId, batchName, courseName, event);
  }

  setSingleStudentCheckbox(event, selectedstudent, batchId) {
    event.stopPropagation();
        this.selectedStudentData = this.studentData.filter(student => {
      if (student.studentId === selectedstudent.studentId) {
        if (event.target.checked) {
          student.checkbox = true;
          this.selectedflag = true;
          return student;
        } else {
          this.batchService.uncheckBatchBox(this.batchData, batchId);
          student.checkbox = false;
          this.selectedflag = false;
          return student;
        }
      }
     });
     this.batchData = this.batchService.batchDataUpdate(this.batchData, batchId, this.selectedflag);
     this.batchData = this.batchService.batchServiceCheck(this.batchData, batchId);
    if (!event.target.checked) {
      this.sharedData.reomoveTotalSelectedStudent(this.selectedStudentData);
      this.counttotalSelectedStudent = this.sharedData.getCountTotalSelectedStudent();
    } else {
      this.sharedData.setTotalSelectedStudentData(this.selectedStudentData);
      this.counttotalSelectedStudent = this.sharedData.getCountTotalSelectedStudent();
    }
    this.studentData = this.sharedData.concatStudentData(this.studentData);
  }
  viewselected() {
    this.studentData = this.sharedData.getTotalSelectedStudent();
    if (this.studentData === undefined || this.studentData.length === 0) {
      // this.nothingSelected=true;
      this.nostudent = true;
    }
    this.nothingSelected = false;
    // this.nostudent="";
  }

  onSubmit() {
    const message = this.myform.value.message;
    if (message) {
      this.sendService.sendNotification(message).subscribe(response => {
        this.response = response;
        if (this.response === 'false') {
          this.formError = 'No student is selected';
        } else {
        this.formError = 'Message sent successfully';
        // this.myform.value.message="enter text...";
        (<HTMLFormElement>document.getElementById('myForm')).reset();
        }
      });
    console.log('response', this.response);
    } else {
      this.formError = 'please enter message';
    }

  }

  // data transform

  public getbatchDetails(): Observable<Array<any>> {
    if (this.batchList.length > 0) {
      this.batchDetails = this.batchList.map(batch => {
        batch['name'] = batch.name;
        batch['checkbox'] = false;
        batch['selectedStudent'] = 0;
        return batch;
      });
      return observableOf(this.batchDetails);
    }
  }

  getAllBatchDetails2(searchParams) {
    return this.batchSearch(searchParams);
  }
  batchSearch(requestParam: SearchParam): Observable<ServerResponse> {
    const option = {
      url: this.configService.urlConFig.URLS.BATCH.GET_BATCHS,
      data: {
        request: {
          filters: requestParam.filters,
          limit: requestParam.limit,
          sort_by: requestParam.sort_by
        }
      }
    };
    return this.learnerService.post(option);
  }


  getAllBatchDetails(courseId, courseMentor) {
    this.showBatchList = false;
    this.showError = false;
    const searchParams: any = {
      filters: {
        status: this.batchStatus.toString(),
        courseId: courseId
      },
      offset: 0,
      sort_by: { createdDate: 'desc' }
    };
    const searchParamsCreator = _.cloneDeep(searchParams);
    if (courseMentor) {
      searchParamsCreator.filters.createdBy = this.userService.userid;
        this.getAllBatchDetails2(searchParamsCreator)
      .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {
            this.batchList = data.result.response.content;
            this.batchList = this.batchList.filter(batch => {
              if (batch.participant) {
                const batchInstance = {};
                batchInstance['batchId'] = batch.id;
                batchInstance['batchName'] = batch.name;
                batchInstance['courseName'] = batch.courseAdditionalInfo.courseName;
                // if (batch.participant) {
                //   batchInstance["totalStudent"] = Object.keys(batch.participant).length;
                // } else {
                //   batchInstance["totalStudent"] = 0;
                // }
                batchInstance['totalStudent'] = Object.keys(batch.participant).length;
                batchInstance['selectedStudent'] = 0;
                batchInstance['checkbox'] = false;
                batchInstance['subscribedUser'] = 0;
                this.courseName = batch.courseAdditionalInfo.courseName;
                this.batchData.push(batchInstance);
                return batch;
              }
             });
          this.ghosts = [];
            this.fetchUserDetails(event);
        }, (err) => {
          this.showError = true;
          this.toasterService.error(this.resourceService.messages.fmsg.m0004);
        });
    }
  }

  fetchUserDetails(event, batchName?, courseName?, batchId?) {
    if (this.batchList.length > 0) {
      if (batchId) {
        this.batchList.filter(batch => {
          if (batch.id === batchId) {
            if (batch.participant) {
              this.participantIds = Object.keys(batch.participant);
              if (this.participantIds.length > 0) {

                this.populateUserProfile(batchId, batchName, courseName, event);
                this.nostudent = false;
              }
            } else {
              this.studentData = [];
              this.ghosts2 = [];
              this.nostudent = true;
            }
          }
        });
      } else {
        if (this.batchList[0].participant) {
          this.participantIds = Object.keys(this.batchList[0].participant);
          if (this.participantIds.length > 0) {
            this.populateUserProfile(this.batchList[0].id, this.batchList[0].name,
              this.batchList[0].courseAdditionalInfo.courseName, event);
            this.nostudent = '';
            this.ghosts2 = [];
          }
        } else {
          this.studentData = [];
          this.ghosts2 = [];
          this.nostudent = true;
        }

      }
    }
  }

  // student details

  populateUserProfile(batchId, batchName, courseName, event) {

     this.getUserById().subscribe(
      (apiResponse: ServerResponse) => {
        let subscribedCount = 0;
        let temarray = [];
        let subuser = 0;
        this.userDetails = apiResponse.result.response.content;
        this.userDetails.forEach(user => {
          const userInstance = {};
          userInstance['studentId'] = user.id;
          userInstance['studentFirstName'] = user.firstName;
          userInstance['studentLastName'] = user.lastName;
          userInstance['batchId'] = batchId;
          userInstance['batchName'] = batchName;
          userInstance['courseName'] = courseName;
          // userInstance["emailId"]=user.emailId;
          userInstance['checkbox'] = false;
          userInstance['token'] = user.profileSummary;
          if (user.profileSummary) {
            userInstance['subscribe'] = 'Subscribed';
            userInstance['disabled'] = false;
          } else {
            userInstance['subscribe'] = 'Not Subscribed';
            userInstance['disabled'] = true;
          }
          temarray.push(userInstance);
        });
        // this.studentData=temarray;
        this.ghosts2 = [];

        if (temarray.length > 0) {
          this.nothingSelected = false;
          this.nostudent = '';
          this.batch = this.batchService.getbatch(batchId, this.batchData);

          if (this.batch[0].checkbox === true) {
            temarray = temarray.map(student => {
              if (student) {
                if (!student.disabled) {
                student['checkbox'] = true;
                subscribedCount = subscribedCount + 1;
                subuser = subuser + 1;
                return student;
                }  else {
                  return student;
                }
              }
            });
            this.batch[0].selectedStudent = subscribedCount;
            if (event.target.checked === true) {
            this.sharedData.setTotalSelectedStudentData(temarray);
            this.counttotalSelectedStudent = this.sharedData.getCountTotalSelectedStudent();
            }
          } else {
            temarray = temarray.map(student => {
              if (student) {
                student['checkbox'] = false;
                subuser = subuser + 1;
                return student;
              }
            });
            if (event.target.checked === false) {
           this.sharedData.reomoveTotalSelectedStudent(temarray);
           this.counttotalSelectedStudent = this.sharedData.getCountTotalSelectedStudent();
            }
           }
           this.batch[0].subscribedUser = subuser;

          this.studentData = this.sharedData.concatStudentData(temarray);

        }
      },
      err => {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
        this.showError = true;
      }
    );
  }

  getUserById() {
    const option = {
      url: this.configService.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        'request': {
          'filters': {
            'userId': this.participantIds
          }
        }
      }
    };
    return this.learnerService.post(option);
  }

  // student details

}
