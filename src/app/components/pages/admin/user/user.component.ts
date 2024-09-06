import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { TerminalService } from 'src/app/services/terminal/devicelist';
import { SharedServices } from 'src/app/services/shared.service';
import { ActiveComponent } from 'src/app/components/dialogs/active/active.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  users: any = []
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
  constructor(public dialog: MatDialog, private dataService: TerminalService,private shared:SharedServices) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.loginData = this.shared.getLoginData();
    this.loginData = localStorage.getItem("SA");
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
    );
    this.loginData === 'true' ? this.tenantsApiResponse() : console.log("check");
    this.roleApiResponse();
    this.alertApiResponse();
  }

  tenantsApiResponse() {
    this.dataService.tenantData().subscribe(
      response => {
        this.tenantsData = response.event.eventData.tenants
        this.tenantsData.forEach(name => {
          this.tenantsNames.push(name.name);
        });
      }
    )
  }

  roleApiResponse() {
    this.dataService.roleData().subscribe(
      response => {
        this.rolesData = response.event.eventData.tenantRoles
        this.rolesData.forEach(name => {
          this.rolesNames.push(name.name);
        });
      }
    )
  }

  alertApiResponse() {
    this.dataService.alertData().subscribe(
      response => {
        this.alertsData = response.event.eventData.alerts
        this.alertsData.forEach(name => {
          this.alertsNames.push(name.name);
        });
      }
    )
  }

  openCreateDialog(edit?): void {
    const dialogRef = this.dialog.open(AddFormComponent,{
     data : {
        title : edit ? 'Edit User' : 'Add User',
        tenantOptionNames : this.tenantsNames,
        roleOptionNames : this.rolesNames,
        alertOptionNames : this.alertsNames,
        form : {
            tenant: ['PAYQ'],
            role: ['IT_ADMIN'],
            alert: 'DEVICE SWAPPED',
            firstName: 'Sandeep',
            lastName: 'Reddy',
            dob: '2000-06-06',
            email: 'sandeep@gmail.com',
            phone: '1234567891',
            country: 'INDIA',
            altemail: 'sandy@gmail.com',
            altphone: '2211221122',
            altcountry: 'INDIA',
          }
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

  openActiveDialog(data): void {
    const dialogRef = this.dialog.open(ActiveComponent,{
        data : {
            title : data == 'active' ? 'In Active Tenants' : 'Active Tenants',
            items: [
                { label: 'Option 1', checked: false },
                { label: 'Option 2', checked: false },
                { label: 'Option 3', checked: false },
                { label: 'Option 4', checked: false }
              ]
        },
        width : '25%'
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
