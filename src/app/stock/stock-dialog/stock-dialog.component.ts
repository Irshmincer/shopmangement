import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { StockService } from '../service/stock.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-stock-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, HttpClientModule],
  templateUrl: './stock-dialog.component.html',
  providers:[StockService]
})
export class StockDialogComponent {
  stockTypes: string[] = ['Fish', 'Prawn'];

  constructor(
    private shopService: StockService,
    public dialogRef: MatDialogRef<StockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  onSave(): void {
    console.log('Saving:', this.data);

    if (this.data.id) {
      // Update shop
      this.shopService.updatestock(this.data).subscribe(response => {
        console.log('Updated stock:', response);
        this.dialogRef.close(response); // Send updated shop back
      });
    } else {
      // Add new shop
      this.shopService.addStock(this.data).subscribe(response => {
        console.log('New stock added:', response);
        this.dialogRef.close(response); // Send new shop back
      });
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }
}
