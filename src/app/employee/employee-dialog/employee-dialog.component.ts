import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrl: './employee-dialog.component.scss',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatDialogModule],
  standalone: true,


})
export class EmployeeDialogComponent {
  employeeForm = new FormGroup({
    name: new FormControl(this.data?.name || '', Validators.required),
    mobile: new FormControl(this.data?.mobile || '', [Validators.required, Validators.pattern('[0-9]{10}')]),
    address: new FormControl(this.data?.address || '', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  saveEmployee() {
    if (this.employeeForm.valid) {
      this.dialogRef.close({ ...this.data, ...this.employeeForm.value });
    }
  }
}
