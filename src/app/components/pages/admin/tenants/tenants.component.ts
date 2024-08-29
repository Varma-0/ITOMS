import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss'
})
export class TenantsComponent {
  day = 'Tue'
  date = '20';  
  month = 'Aug'; 
  tenantName = 'INA QUICKPAY'; 
  tenantDetails = 'sandeepreddymukku143@gmail.com on 2024-06-06'; 
  tenantType = 'COMPANY';
  isActive: boolean = true;
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
