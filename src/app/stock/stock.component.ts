import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { StockDialogComponent } from './stock-dialog/stock-dialog.component';
import { StockService } from './service/stock.service';
import { stock } from './model/stock.model';
import { HttpClientModule } from '@angular/common/http';
import { log } from 'console';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';




@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, HttpClientModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
  providers:[StockService]

})
export class StockComponent implements OnInit {
  displayedColumns: string[] = ['id', 'StockName', 'Quantity', 'actions'];
  dataSource = new MatTableDataSource<stock>([]);;
  private _snackBar = inject(MatSnackBar);

  constructor(public dialog: MatDialog, private service: StockService) {}
  ngOnInit(): void {
   this.loadStock()
  }

  loadStock(){
    this.service.getAllStock().subscribe(result =>{
      this.dataSource.data = result
    },
    error =>{
      this._snackBar.open(`${error}`, 'ok',{duration:2000, verticalPosition:'top'})
    })
  }


  openStockDialog(stock?: stock) {
    console.log(stock);

    const dialogRef = this.dialog.open(StockDialogComponent, {
      height: '350px',
      width: '300px',
      data: stock ? { ...stock } : {} // Pass a copy of the shop data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (stock) {
          // Update existing shop
          const index = this.dataSource.data.findIndex(s => s.id === stock.id);
          if (index !== -1) {
            this.dataSource.data[index] = Object.assign({}, result); // Ensure object reference updates
          }
        } else {
          // Add new shop
          this.dataSource.data.push(result);
        }

        // Assign new reference to trigger change detection
        this.dataSource.data = [...this.dataSource.data];
        this.loadStock()
      }
    });
  }

  deleteStock(id: number) {
    this.service.deletestock(id).subscribe(result =>{
      this._snackBar.open("Deleted Successfully", 'ok',{duration:2000, verticalPosition:'top'})
      this.dataSource.data = this.dataSource.data.filter((stock:any) => stock.id !== id);
      this.loadStock()
    },
    error =>{
      this._snackBar.open(`${error}`, 'ok',{duration:2000, verticalPosition:'top'})

    })
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock');

    // Generate and save file
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Stocks.xlsx');
  }
}
