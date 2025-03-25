import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShopService } from '../../service/shop.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-shop-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './shop-dialog.component.html',
  providers: [ShopService]
})
export class ShopDialogComponent {
  shopForm !:FormGroup;
  private _snackBar = inject(MatSnackBar);

  constructor(
    private shopService: ShopService,
    public dialogRef: MatDialogRef<ShopDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}


  ngOnInit(){
    this.shopForm = this.fb.group({
      Shop_Name: [this.data?.Shop_Name || '', Validators.required],
      Address: [this.data?.Address || '', [Validators.required]],
      Rent_Amount: [this.data?.Rent_Amount || '', [Validators.required]],

    });
  }


  onSave(): void {
    if (this.shopForm.invalid) return;
    let shopData = {
      id: this.data?.id || null,
      Shop_Name: this.shopForm.value['Shop_Name'],
      Address: this.shopForm.value['Address'],
      Rent_Amount: this.shopForm.value['Rent_Amount']

    };



    if (this.data?.id) {
      // Update shop
      this.shopService.updateShop(shopData).subscribe(response => {
        this._snackBar.open("Updated Successfully", 'ok',{duration:2000, verticalPosition:'top'})

        this.dialogRef.close(response); // Send updated shop back
      });
    } else {
      // Add new shop
      this.shopService.addShop(shopData).subscribe(response => {
        this._snackBar.open("Added Successfully", 'ok',{duration:2000, verticalPosition:'top'})

        this.dialogRef.close(response); // Send new shop back
      });
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }
}
