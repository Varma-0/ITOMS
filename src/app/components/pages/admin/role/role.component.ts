import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent {
  day = 'Tue'
  date = '20';  
  month = 'Aug'; 
  userRole = 'IT_ADMIN'; 
  userDate = '2024-06-06'; 
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
