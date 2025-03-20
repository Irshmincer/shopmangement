import { Injectable } from '@angular/core';
import { stock } from '../model/stock.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiUrl ='http://localhost:3000/api/stock/'


  constructor(private http : HttpClient) { }


  getAllStock():Observable<stock[]>{
    return this.http.get<stock[]>(this.apiUrl)
  }

  addStock(stock: stock): Observable<stock> {
    return this.http.post<stock>(this.apiUrl, stock);
  }

  updatestock(stock: stock): Observable<stock> {
    return this.http.put<stock>(`${this.apiUrl}${stock.id}`, stock);
  }

  deletestock(stockID: number): Observable<stock> {
    return this.http.delete<stock>(`${this.apiUrl}${stockID}`);
  }
}
