import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-hierarchy-level',
  templateUrl: './hierarchy-level.component.html',
  styleUrl: './hierarchy-level.component.scss'
})
export class HierarchyLevelComponent {
  day = 'Tue'
  date = '20';  
  month = 'Aug'; 
  hierarchyLevelName = 'ORGANIZATION'; 
  levelDetails = '2024-06-06'; 
  levelStatus = 'sandeep reddy';
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
