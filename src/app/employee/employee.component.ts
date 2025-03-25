import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';
import { AttendanceDialogComponent } from './attendance-dialog/attendance-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { attendance, employees } from './model/employee.model';
import { EmployeeService } from './service/employee.service';
import { HttpClientModule } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { error } from 'console';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    MatIconModule,
    CommonModule,
    HttpClientModule,
    MatDatepickerModule,
    FormsModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
  providers: [EmployeeService],
})
export class EmployeeComponent implements OnInit {
  fromDate: Date | null = null; // For filtering attendance by date range
  toDate: Date | null = null;
  displayedColumns: string[] = ['id', 'name', 'mobile', 'address', 'actions'];
  displayedColumnsAttendance: string[] = [
    'id',
    'name',
    'date',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<employees>([]);
  dataSourceAttendance = new MatTableDataSource<attendance>([]);
  private _snackBar = inject(MatSnackBar);

  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService
  ) {}
  ngOnInit(): void {
    this.loadEmployee();
    this.loadAttendance();
  }

  loadEmployee() {
    this.employeeService.getAllEmployee().subscribe((result) => {
      this.dataSource.data = result;
    });
  }

  loadAttendance() {
    this.employeeService.getAllAttendance().subscribe((result) => {
      console.log(result);

      this.dataSourceAttendance.data = result;
    });
  }
  openEmployeeDialog(employee?: employees) {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '400px',
      data: employee ? { ...employee } : {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEmployee(); // Reload the employee data from API
      }
    });
  }

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe(result => {
      if(result){
        this.dataSource.data = this.dataSource.data.filter((emp) => emp.id !== id);
        this.loadEmployee()
        this._snackBar.open("Deleted Succesfully", 'ok', {duration : 2000, verticalPosition: 'top'})

      }
      else{
      this._snackBar.open("Error", 'ok', {duration : 2000, verticalPosition: 'top'})

      }

    })
  }

  openAttendanceDialog(employee?: employees) {
    const dialogRef = this.dialog.open(AttendanceDialogComponent, {
      width: '400px',
      data: employee ? { ...employee } : {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAttendance(); // Reload the attendance data from API
      }
    });
  }

  deleteAttendanceEmployee(id: number) {
    this.employeeService.deleteAttendance(id).subscribe((result) =>{
      this._snackBar.open("Deleted Succesfully", 'ok', {duration : 2000, verticalPosition: 'top'}
      );
      this.dataSource.data = this.dataSource.data.filter((emp) => emp.id !== id);
      this.loadAttendance()
    },
    error => {
      this._snackBar.open(`${error}`);
    }
    )
  }
  exportEmployeesToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.dataSource.data
    );
    const workbook: XLSX.WorkBook = {
      Sheets: { Employees: worksheet },
      SheetNames: ['Employees'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFile(excelBuffer, 'Employees');
  }

  private filterAttendanceData(): any[] {
    if (!this.fromDate && !this.toDate) {
      return this.dataSourceAttendance.data; // No filters applied, return all data
    }

    return this.dataSourceAttendance.data.filter((entry) => {
      const entryDate = new Date(entry.date);

      return (
        (!this.fromDate || entryDate >= new Date(this.fromDate)) &&
        (!this.toDate || entryDate <= new Date(this.toDate))
      );
    });
  }

  // 🔹 Export Attendance Data (Filtered by Date Range) to Excel
  exportAttendanceToExcel(): void {
    // Filter attendance data based on date range
    const filteredData = this.filterAttendanceData();

    if (filteredData.length === 0) {
      this._snackBar.open('No attendance data found for the selected date range.', 'ok');
      return;
    }

    // Convert to Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook: XLSX.WorkBook = {
      Sheets: { Attendance: worksheet },
      SheetNames: ['Attendance'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFile(excelBuffer, 'Attendance');
  }
  // Utility function to save file
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, `${fileName}.xlsx`);
  }

  // openAttendanceDialog() {
  //   this.dialog.open(AttendanceDialogComponent, {
  //     width: '400px'
  //   });
  // }
}
