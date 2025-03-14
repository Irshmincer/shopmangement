import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-attendance-dialog',
  templateUrl: './attendance-dialog.component.html',
  styleUrl: './attendance-dialog.component.scss',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatDialogModule],
  standalone: true,

})
export class AttendanceDialogComponent {
  attendanceForm = new FormGroup({
    employeeId: new FormControl('', Validators.required),
    status: new FormControl('Present', Validators.required)
  });

  constructor(public dialogRef: MatDialogRef<AttendanceDialogComponent>) {}

  saveAttendance() {
    if (this.attendanceForm.valid) {
      this.dialogRef.close(this.attendanceForm.value);
    }
  }
}
