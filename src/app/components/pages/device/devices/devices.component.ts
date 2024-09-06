import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { DevicesFormComponent } from 'src/app/components/dialogs/device-form/device-form.component';
import { SharedServices } from 'src/app/services/shared.service';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent {
  device: any = []
  tenantsData:any;
  rolesData:any;
  alertsData:any;
  tenantsNames: any = [];
  rolesNames: any = [];
  alertsNames: any = [];
  time: any = '';
  fulldate:any = '';
  day:any = '';
  date: any='';
  month: any = '';
  loginData: any;
  isActive: boolean;

  constructor(public dialog: MatDialog, private dataService: TerminalService,private shared:SharedServices) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.loginData = this.shared.getLoginData();
    this.loginData = localStorage.getItem("SA");
    console.log("uigfiqw",this.loginData);
    const event = new terminalEvent('DEVICE', 'SEARCH');
    const terminalRequest = new terminalBody(event);
    this.dataService.terminalData(terminalRequest).subscribe(
      response => {
        console.log(response);

        // Process each device in the eventData array
        this.device = response.event.eventData.map(data => {
          // Determine if the device is active
          const isActive = data.status === 'ACTIVE';

          // Extract date and time information from createdBy timestamp
          const time = data.createdBy.ts;
          const fulldate = time.split('T')[0];

          // Parse the full date string into a Date object
          const dateObject = new Date(fulldate);

          // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const day = daysOfWeek[dateObject.getUTCDay()];

          // Extract the day of the month
          const date = fulldate.split('-')[2];

          // Get the month name from the date
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const month = monthNames[dateObject.getUTCMonth()];

          // Return each device with additional date-related info and status
          return {
            ...data,
            isActive,     // Active status of the device
            time,         // Original timestamp
            fulldate,     // Full date in YYYY-MM-DD format
            day,          // Day of the week (e.g., 'Fri')
            date,         // Day of the month (e.g., '20')
            month         // Month (e.g., 'Jun')
          };
        });

        // Log the updated device array with all additional info
        console.log('Updated device data:', this.device);
      },
      error => {
        console.error('Error:', error);
      }
    );

  }




  toggleStatus(isActive: boolean) {
    // Update user status based on the toggle position
    isActive ? 'ACTIVE' : 'INACTIVE';
  }

  openCreateDialog(edit?): void {
    const dialogRef = this.dialog.open(DevicesFormComponent,{
     data : {
        title : edit ? 'Edit Device' : 'Add Device',
        hierarchy : ['Test','New','Ok'],
        form:{
            sno: ['8821'],
            skey: ['1281891'],
            modal: ['TH28'],
            hierarchy: ['Test'],
        }
     },
     width : '40%'
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
