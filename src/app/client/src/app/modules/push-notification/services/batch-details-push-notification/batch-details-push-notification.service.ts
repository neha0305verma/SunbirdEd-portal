import { of as observableOf, throwError as observableThrowError, Observable, combineLatest, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { BatchDetails, StudentDetails } from '../../interfaces';
import { HttpClient } from '@angular/common/http';
import { ServerResponse, ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { takeUntil } from 'rxjs/operators';
import { CourseBatchService } from './../../../learn/services/index';
import * as _ from 'lodash';


import { UserService, SearchParam, LearnerService } from '@sunbird/core';

@Injectable({
  providedIn: 'root'
})

export class BatchDetailsPushNotificationService {
  enrolledstudentData;
  batchDetailsInt;
  studentDetailsInt;
  enrolledStudents;

  constructor() {}

  public setenrolledStudent(studentData) {
    this.enrolledStudents = studentData;
  }
  public getenrolledStudent(batchId): Observable<Array<any>> {
    const studentData = this.enrolledStudents.filter(student => {
        if (student.batchId === batchId) {
          student['checkbox'] = false;
          return student;
        }
      });
    return observableOf(studentData);
  }
  public getbatch(batchId, batchData) {
    const batchtemp = batchData.filter(batch => {
      if (batchId === batch.batchId) {
        return batch;
      }
    });
    return batchtemp;
  }

  public batchDataUpdate(batchData, batchId, flag) {
    const tembatchData = batchData.filter(batch => {
      if (batch.batchId === batchId) {
        if (flag) {
          batch.selectedStudent = batch.selectedStudent + 1;
        } else if (batch.selectedStudent > 0) {
          batch.selectedStudent = batch.selectedStudent - 1;
        }
        return batch;
      }
      return batch;
    });
    return tembatchData;
  }

  public batchServiceCheck(batchData, batchId) {
    const tembatchData = batchData.map(batch => {
      if (batch.batchId === batchId) {
        if (batch.subscribedUser === batch.selectedStudent) {
          batch.checkbox = true;
        }
        return batch;
      }
      return batch;
    });
    return tembatchData;

  }
  public uncheckBatchBox(batchData, batchId) {
    const tembatchData = batchData.map(batch => {
      if (batch.batchId === batchId) {
        batch.checkbox = false;
        return batch;
      }
      return batch;
    });
    return tembatchData;
  }
}
