import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { EmployeeService } from '../service/employee.service';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrl: './employee-dialog.component.scss',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatDialogModule, MatInputModule, FormsModule],
  standalone: true,
  providers: [EmployeeService]

})
export class EmployeeDialogComponent {
  constructor(
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  onSave(): void {
    console.log('Saving:', this.data);

    if (this.data.id) {
      // Update shop
      this.employeeService.updateEmployee(this.data).subscribe(response => {
        console.log('Updated shop:', response);
        this.dialogRef.close(response); // Send updated shop back
      });
    } else {
      // Add new shop
      this.employeeService.addEmployee(this.data).subscribe(response => {
        console.log('New shop added:', response);
        this.dialogRef.close(response); // Send new shop back
      });
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }
}
