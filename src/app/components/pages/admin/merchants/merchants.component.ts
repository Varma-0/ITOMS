import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  styleUrl: './merchants.component.scss'
})
export class MerchantsComponent {
  // day = 'Tue'
  // date = '20';  
  // month = 'Aug'; 
  // merchantName = 'Big_Sale_Mart'; 
  // merchantDetails = '2024-06-06'; 
  // merchantEmail = 'salebigmart@gmail.com'
  // merchantType = 'BIG CORP';
  merchants: any = []
  time: any = '';
  fulldate:any = '';
  day:any = '';
  date: any='';
  month: any = '';
  constructor(public dialog: MatDialog, private dataService: TerminalService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const event = new terminalEvent('MERCHANT', 'SEARCH');
    const merchantRequest = new terminalBody(event);
    this.dataService.merchantData(merchantRequest).subscribe(
      response => {
        console.log(response);
        this.merchants = response.event.eventData
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
