import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { ShopComponent } from './shop/shop.component';
import { StockComponent } from './stock/stock.component';

export const routes: Routes = [
  {
    path: 'employee',
    component: EmployeeComponent,
  },
  { path: 'shop', component: ShopComponent },
  { path: 'stock', component: StockComponent },
  { path: '**', redirectTo: 'employee' }

];
