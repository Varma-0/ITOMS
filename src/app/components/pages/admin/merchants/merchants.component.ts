import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  styleUrl: './merchants.component.scss'
})
export class MerchantsComponent {
  day = 'Tue'
  date = '20';  
  month = 'Aug'; 
  merchantName = 'Big_Sale_Mart'; 
  merchantDetails = '2024-06-06'; 
  merchantEmail = 'salebigmart@gmail.com'
  merchantType = 'BIG CORP';
  constructor(public dialog: MatDialog) {}

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Implement delete functionality here
        console.log('User deleted');
      }
    });
  }
}
