import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EmployeeService } from '../service/employee.service';
import { employees } from '../model/employee.model';
import { log } from 'console';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance-dialog',
  templateUrl: './attendance-dialog.component.html',
  styleUrl: './attendance-dialog.component.scss',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    CommonModule

  ],
  standalone: true,
  providers: [EmployeeService]

})
export class AttendanceDialogComponent implements OnInit {
  attendanceForm: FormGroup;
  employees!: employees[];

  today = new Date(); // Get today's date
  constructor(
    private attendanceService: EmployeeService,
    public dialogRef: MatDialogRef<AttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.attendanceForm = new FormGroup({
      employeeId: new FormControl(data?.employeeId || '', Validators.required),
      date: new FormControl(data?.date || new Date(), Validators.required),
      status: new FormControl(data?.status || 'Present', Validators.required)
    });
  }
  ngOnInit(): void {
    this.attendanceService.getAllEmployee().subscribe(result =>{
      console.log(result);

      this.employees = result;
      if (this.data?.employeeId) {
        const selectedEmployee = this.employees.find(emp => emp.id === this.data.employeeId);
        if (selectedEmployee) {
          this.attendanceForm.controls['employeeId'].setValue(selectedEmployee.id);
        }
      }
    })
  }




  onSave(): void {
    if (this.attendanceForm.valid) {
      let attendanceData = { ...this.data, ...this.attendanceForm.value };

      // Convert date to MySQL compatible format (YYYY-MM-DD HH:MM:SS)
      attendanceData.date = new Date(attendanceData.date).toISOString().slice(0, 19).replace('T', ' ');

      console.log('Submitting Attendance Data:', attendanceData);

      if (attendanceData.id) {
        this.attendanceService.updateAttendance(attendanceData).subscribe({
          next: (response) => {
            console.log('Updated Attendance:', response);
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Error updating attendance:', error);
          }
        });
      } else {
        this.attendanceService.addAttendance(attendanceData).subscribe({
          next: (response) => {
            console.log('New Attendance Added:', response);
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Error adding attendance:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
