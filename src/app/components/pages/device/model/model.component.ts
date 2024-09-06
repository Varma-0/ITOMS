import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { SharedServices } from 'src/app/services/shared.service';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrl: './model.component.scss'
})
export class ModelComponent {
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
    const event = new terminalEvent('MODEL', 'SEARCH');
    const terminalRequest = new terminalBody(event);
    this.dataService.modelData(terminalRequest).subscribe(
      response => {
        console.log(response);
        this.device = response.event.eventData.map(data => {
          // Extract date and time info from createdBy timestamp
          const time = data.createdBy.ts;
          const fulldate = time.split('T')[0];
    
          // Parse the date string to a Date object
          const dateObject = new Date(fulldate);
    
          // Get the day of the week
          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const day = daysOfWeek[dateObject.getUTCDay()];
          this.day = day;
    
          // Get the date and month
          const date = fulldate.split('-')[2];
          this.date = date;
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const month = monthNames[dateObject.getUTCMonth()];
          this.month = month;
    
          // Return each device with additional date-related information
          return {
            ...data,
            time,         // Original timestamp
            fulldate,     // Full date in YYYY-MM-DD format
            day,          // Day of the week (e.g., 'Fri')
            date,         // Day of the month (e.g., '20')
            month         // Month (e.g., 'Jun')
          };
        });
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

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AddFormComponent,{
     data : {
        title : 'Add User',
        tenantOptionNames : this.tenantsNames,
        roleOptionNames : this.rolesNames,
        alertOptionNames : this.alertsNames,
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
