import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ShopService } from '../service/shop.service';
import { HttpClientModule } from '@angular/common/http';
import { shop } from '../service/shop.model';
import { ShopDialogComponent } from './shop-dialog/shop-dialog.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, HttpClientModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
  providers: [ShopService]
})
export class ShopComponent implements OnInit {
  displayedColumns: string[] = ['id', 'Shop_Name', 'Address', 'Rent_Amount', 'actions'];
  dataSource = new MatTableDataSource<shop>([]);;

  constructor(public dialog: MatDialog, private shopservice: ShopService) {}
  ngOnInit(): void {
  this.loadShop()
  }


  loadShop(){
    this.shopservice.getAllShop().subscribe(result => {
      this.dataSource.data = result;

    }
    )
  }


  openShopDialog(shop?: shop) {
    const dialogRef = this.dialog.open(ShopDialogComponent, {
      height: '350px  ',
      width: '400px',
      data: shop ? { ...shop } : {} // Pass a copy of the shop data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (shop) {
          // Update existing shop
          const index = this.dataSource.data.findIndex(s => s.id === shop.id);
          if (index !== -1) {
            this.dataSource.data[index] = Object.assign({}, result); // Ensure object reference updates
          }
        } else {
          // Add new shop
          this.dataSource.data.push(result);
        }

        // Assign new reference to trigger change detection
        this.dataSource.data = [...this.dataSource.data];
        this.loadShop()
      }
    });
  }

  onDelete(shop: any): void {
    if (confirm('Are you sure you want to delete this shop?')) {
      this.shopservice.deleteShop(shop.id).subscribe(response => {
        console.log('Deleted shop:', response);
        this.loadShop()
      });
    }
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Shops');

    // Generate and save file
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Shops.xlsx');
  }
}
