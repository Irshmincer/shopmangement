import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShopService } from '../../service/shop.service';

@Component({
  selector: 'app-shop-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './shop-dialog.component.html',
  providers: [ShopService]
})
export class ShopDialogComponent {
  constructor(
    private shopService: ShopService,
    public dialogRef: MatDialogRef<ShopDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  onSave(): void {
    console.log('Saving:', this.data);

    if (this.data.id) {
      // Update shop
      this.shopService.updateShop(this.data).subscribe(response => {
        console.log('Updated shop:', response);
        this.dialogRef.close(response); // Send updated shop back
      });
    } else {
      // Add new shop
      this.shopService.addShop(this.data).subscribe(response => {
        console.log('New shop added:', response);
        this.dialogRef.close(response); // Send new shop back
      });
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }
}
