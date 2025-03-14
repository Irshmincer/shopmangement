import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { StockDialogComponent } from './stock-dialog/stock-dialog.component';

export interface Stock {
  id: number;
  name: string;
  quantity: number;
}

const STOCK_DATA: Stock[] = [
  { id: 1, name: 'Fish', quantity: 50 },
  { id: 2, name: 'Prawn', quantity: 30 }
];

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class StockComponent {
  displayedColumns: string[] = ['id', 'name', 'quantity', 'actions'];
  dataSource = [...STOCK_DATA];

  constructor(public dialog: MatDialog) {}

  openStockDialog(stock?: Stock) {
    const dialogRef = this.dialog.open(StockDialogComponent, {
      width: '400px',
      data: stock ? { ...stock } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (stock) {
          // Update existing stock
          const index = this.dataSource.findIndex(s => s.id === stock.id);
          if (index !== -1) {
            this.dataSource[index] = result;
          }
        } else {
          // Add new stock
          result.id = this.dataSource.length + 1;
          this.dataSource.push(result);
        }
        this.dataSource = [...this.dataSource]; // Refresh table
      }
    });
  }

  deleteStock(id: number) {
    this.dataSource = this.dataSource.filter(stock => stock.id !== id);
  }
}
