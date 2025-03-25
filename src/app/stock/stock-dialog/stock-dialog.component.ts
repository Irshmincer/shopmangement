import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { StockService } from '../service/stock.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stock-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './stock-dialog.component.html',
  providers: [StockService]
})
export class StockDialogComponent implements OnInit {
  stockTypes: string[] = ['Fish', 'Prawn'];
  stockForm!: FormGroup;
  private _snackBar = inject(MatSnackBar);

  constructor(
    private stockService: StockService,
    public dialogRef: MatDialogRef<StockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.stockForm = this.fb.group({
      StockType: [this.data?.StockType || '', Validators.required],
      Quantity: [this.data?.Quantity || '', [Validators.required, Validators.min(1)]]
    });
  }

  onSave(): void {
    if (this.stockForm.invalid) return; // Prevent invalid form submission

    let stockData = {
      id: this.data?.id || null, // Ensure ID is handled correctly
      StockType: this.stockForm.value['StockType'],
      Quantity: this.stockForm.value['Quantity']
    };

    if (this.data?.id) {
      // Update stock
      this.stockService.updatestock(stockData).subscribe(response => {
        this._snackBar.open("Updated Successfully", 'ok',{duration:2000, verticalPosition:'top'})
        this.dialogRef.close(response);
      },
      error =>{
        this._snackBar.open(`${error}`, 'ok',{duration:2000, verticalPosition:'top'})

      });
    } else {
      // Add new stock
      this.stockService.addStock(stockData).subscribe(response => {
        this._snackBar.open("Added Successfully", 'ok',{duration:2000, verticalPosition:'top'})

        this.dialogRef.close(response);
      },
      error =>{
        this._snackBar.open(`${error}`, 'ok',{duration:2000, verticalPosition:'top'})

      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
