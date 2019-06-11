import { Injectable } from '@angular/core';
import { debug } from 'util';

@Injectable({
  providedIn: 'root'
})
export class SharedDataPushNotificationService {
  localcountvar;
  countstudent = 0;
  totalstudent;
  mergedStudentData;
  selectedStudentData;
  totalselectedStudentData = [];
  filteredData;
  constructor() { }

  getSelectedStudent() {
    return this.selectedStudentData;
  }

  setCountStudentSelected(count, batchId) {
    this.localcountvar = [{batchId: batchId, student: count}];
    return this.localcountvar;
  }

  counttotalSelectedStudent(totalstudentselected) {
    this.totalstudent = totalstudentselected.map(studentselected => {
      this.countstudent = this.countstudent + studentselected.student;
      return this.countstudent;
      });
      return this.totalstudent;
  }


  setTotalSelectedStudentData(selectedStudentData) {

    if (this.totalselectedStudentData.length > 0) {
      let flag = true;
       selectedStudentData.filter(student => {
         if (student.checkbox) {
          this.totalselectedStudentData.filter(totalstudent => {
            if (totalstudent.studentId === student.studentId) {
              flag = false;
              } else {
            }
          });
         } else {
           flag = false;
         }
        if (flag) {
          this.totalselectedStudentData.push(student);
        }
      });
    } else {
      selectedStudentData.filter(student => {
        if (student.checkbox) {
          this.totalselectedStudentData.push(student);
        }
      });
    }
   }

  concatStudentData(studentData) {
    if (this.totalselectedStudentData) {
      this.mergedStudentData = studentData.filter(student => {
        return this.filteredData = this.totalselectedStudentData.filter(selectedStudent => {
          if (student && selectedStudent) {
            if (selectedStudent.studentId === student.studentId) {
              student.checkbox = true;
              return student;
            } else {
              return student;
            }
          }
        });
      });
    } else {
      this.mergedStudentData = studentData.map(student => {
        return student;
      });
    }
    return this.mergedStudentData;
  }

  reomoveTotalSelectedStudent(selectedStudentData) {
    if (this.totalselectedStudentData) {
      selectedStudentData.filter(student => {
        this.totalselectedStudentData = this.totalselectedStudentData.filter(selectedstudent => {
         if (student.studentId !== selectedstudent.studentId) {
           return selectedstudent;
         } else {
         }
       });
     });
    }
   }

  getTotalSelectedStudent() {
    return this.totalselectedStudentData;
  }

  getCountTotalSelectedStudent() {
    if (this.totalselectedStudentData.length > 0) {
      return this.totalselectedStudentData.length;
    }
  }
}
