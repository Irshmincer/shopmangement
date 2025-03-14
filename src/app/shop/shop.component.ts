import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ShopDialogComponent } from './shop-dialog/shop-dialog.component';

export interface Shop {
  id: number;
  name: string;
  address: string;
  rent: number;
}

const SHOP_DATA: Shop[] = [
  { id: 1, name: 'Super Mart', address: 'Main Road', rent: 15000 },
  { id: 2, name: 'Mega Store', address: 'Central Street', rent: 20000 }
];

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  displayedColumns: string[] = ['id', 'name', 'address', 'rent', 'actions'];
  dataSource = [...SHOP_DATA];

  constructor(public dialog: MatDialog) {}

  openShopDialog(shop?: Shop) {
    const dialogRef = this.dialog.open(ShopDialogComponent, {
      width: '400px',
      data: shop ? { ...shop } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (shop) {
          // Update existing shop
          const index = this.dataSource.findIndex(s => s.id === shop.id);
          if (index !== -1) {
            this.dataSource[index] = result;
          }
        } else {
          // Add new shop
          result.id = this.dataSource.length + 1;
          this.dataSource.push(result);
        }
        this.dataSource = [...this.dataSource]; // Refresh table
      }
    });
  }

  deleteShop(id: number) {
    this.dataSource = this.dataSource.filter(shop => shop.id !== id);
  }
}
