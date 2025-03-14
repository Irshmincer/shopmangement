import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';
import { AttendanceDialogComponent } from './attendance-dialog/attendance-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface Employee {
  id: number;
  name: string;
  mobile: string;
  address: string;
}

const EMPLOYEE_DATA: Employee[] = [
  { id: 1, name: 'John Doe', mobile: '9876543210', address: 'New York' },
  { id: 2, name: 'Jane Smith', mobile: '9123456789', address: 'Los Angeles' }
];

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [MatButtonModule, MatTableModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatRadioModule, MatDialogModule, MatIconModule, CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {
  displayedColumns: string[] = ['id', 'name', 'mobile', 'address', 'actions'];
  dataSource = [...EMPLOYEE_DATA];

  constructor(public dialog: MatDialog) {}

  openEmployeeDialog(employee?: Employee) {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '400px',
      data: employee ? { ...employee } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (employee) {
          // Update existing employee
          const index = this.dataSource.findIndex(e => e.id === employee.id);
          if (index !== -1) {
            this.dataSource[index] = result;
          }
        } else {
          // Add new employee
          result.id = this.dataSource.length + 1;
          this.dataSource.push(result);
        }
        this.dataSource = [...this.dataSource]; // Refresh table
      }
    });
  }

  deleteEmployee(id: number) {
    this.dataSource = this.dataSource.filter(emp => emp.id !== id);
  }


  openAttendanceDialog(employee?: Employee) {
    const dialogRef = this.dialog.open(AttendanceDialogComponent, {
      width: '400px',
      data: employee ? { ...employee } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (employee) {
          // Update existing employee
          const index = this.dataSource.findIndex(e => e.id === employee.id);
          if (index !== -1) {
            this.dataSource[index] = result;
          }
        } else {
          // Add new employee
          result.id = this.dataSource.length + 1;
          this.dataSource.push(result);
        }
        this.dataSource = [...this.dataSource]; // Refresh table
      }
    });
  }

  deleteAttendanceEmployee(id: number) {
    this.dataSource = this.dataSource.filter(emp => emp.id !== id);
  }

  // openAttendanceDialog() {
  //   this.dialog.open(AttendanceDialogComponent, {
  //     width: '400px'
  //   });
  // }
}
