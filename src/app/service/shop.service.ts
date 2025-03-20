import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shop } from './shop.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private apiUrl ='http://localhost:3000/api/shop/'


  constructor(private http : HttpClient) { }


  getAllShop():Observable<shop[]>{
    return this.http.get<shop[]>(this.apiUrl)
  }

  addShop(shop: shop): Observable<shop> {
    return this.http.post<shop>(this.apiUrl, shop);
  }

  updateShop(shop: shop): Observable<shop> {
    return this.http.put<shop>(`${this.apiUrl}${shop.id}`, shop);
  }

  deleteShop(shopID: number): Observable<shop> {
    return this.http.delete<shop>(`${this.apiUrl}${shopID}`);
  }
}
