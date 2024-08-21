import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  day = 'Tue'
  date = '20';  
  month = 'Aug'; 
  userName = 'Sandeep Reddy'; 
  userEmail = 'sandeepreddymukku143@gmail.com'; 
  userStatus = 'ACTIVE';  
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
