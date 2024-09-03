import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { TerminalService } from 'src/app/services/terminal/devicelist';
import { SharedServices } from 'src/app/services/shared.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  users: any = []
  time: any = '';
  fulldate:any = '';
  day:any = '';
  date: any='';
  month: any = '';
  loginData: any;
  constructor(public dialog: MatDialog, private dataService: TerminalService,private shared:SharedServices) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loginData = this.shared.getLoginData();
    console.log("uigfiqw",this.loginData);
    this.dataService.userData().subscribe(
      response => {
        console.log(response);
        this.users = response.event.eventData.users
        this.time = response.timestamp
        this.fulldate = this.time.split('T')[0];

        // Parse the date string to a Date object
        const dateObject = new Date(this.fulldate);

        // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.day = daysOfWeek[dateObject.getUTCDay()];
        console.log('Day of the week:', this.day); // For example, "Friday"
        this.date = this.fulldate.split('-')[2];
        console.log(this.date);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.month = monthNames[dateObject.getUTCMonth()];
        console.log('Month:', this.month);
      },
      error => {
        console.error('Error:', error);
      }
    )
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AddFormComponent,{
     data : {
        title : 'Add User'
     },
     width : '60%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Implement delete functionality here
        console.log('User deleted');
      }
    });
  }

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
