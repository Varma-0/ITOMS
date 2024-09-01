import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss'
})
export class AlertComponent {
  // day = 'Tue'
  // date = '20';
  // month = 'Aug';
  // alertName = 'DEVICE SWAPPED';
  // userDetails = 'sandeepreddymukku143@gmail.com on 2024-06-06';
  // constructor(public dialog: MatDialog) {}
  alerts: any = []
  time: any = '';
  fulldate:any = '';
  day:any = '';
  date: any='';
  month: any = '';
  userDetails = '';
  userName = '';
  constructor(public dialog: MatDialog, private dataService: TerminalService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.dataService.alertData().subscribe(
      response => {
        console.log(response);
        this.alerts = response.event.eventData.alerts
        this.alerts.forEach(data => {
          this.time = data.createdBy.ts
        this.fulldate = this.time.split('T')[0];
        this.userName = data.createdBy.name;
        this.userDetails = `${this.userName} on ${this.fulldate}`
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
        });
      },
      error => {
        console.error('Error:', error);
      }
    )
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(AddFormComponent,{
        data: {
            title:'Add Alert'
        },
        width:'40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Implement delete functionality here
        console.log('User deleted');
      }
    });
  }
}
