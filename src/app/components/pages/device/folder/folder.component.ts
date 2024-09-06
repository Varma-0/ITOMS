import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { SharedServices } from 'src/app/services/shared.service';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent {
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
        // this.device = response.event.eventData
        this.device = response.event.eventData
        this.device.forEach(data => {
          this.isActive = data.status === 'ACTIVE';
          console.log("eweq",data);
          this.time = data.createdBy.ts
          this.fulldate = this.time.split('T')[0];
          console.log("eweq",this.fulldate);
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
