import { Injectable , inject } from '@angular/core';
import { Observable } from 'rxjs';
import { attendance, employees } from '../model/employee.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl ='http://localhost:3000/api/employees/'
  private apiUrlAttendance ='http://localhost:3000/api/attendance/'

  private http = inject(HttpClient);

  // constructor(private http : HttpClient) { }


  getAllEmployee():Observable<employees[]>{
    return this.http.get<employees[]>(this.apiUrl)
  }

  addEmployee(employee: employees): Observable<employees> {
    return this.http.post<employees>(this.apiUrl, employee);
  }

  updateEmployee(employee: employees): Observable<employees> {
    return this.http.put<employees>(`${this.apiUrl}${employee.id}`, employee);
  }

  deleteEmployee(employeeID: number): Observable<employees> {
    return this.http.delete<employees>(`${this.apiUrl}${employeeID}`);
  }




  getAllAttendance():Observable<attendance[]>{
    return this.http.get<attendance[]>(this.apiUrlAttendance)
  }

  addAttendance(attendance: attendance): Observable<attendance> {
    return this.http.post<attendance>(this.apiUrlAttendance, attendance);
  }

  updateAttendance(attendance: attendance): Observable<attendance> {
    return this.http.put<attendance>(`${this.apiUrlAttendance}${attendance.id}`, attendance);
  }

  deleteAttendance(attendance: number): Observable<attendance> {
    return this.http.delete<attendance>(`${this.apiUrlAttendance}${attendance}`);
  }
}
