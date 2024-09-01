import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { TerminalService } from 'src/app/services/terminal/devicelist';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent {
  roles: any = []
  time: any = '';
  fulldate:any = '';
  day:any = '';
  date: any='';
  month: any = '';
  constructor(public dialog: MatDialog, private dataService: TerminalService) {}

  ngOnInit(): void {
    this.dataService.roleData().subscribe(
      response => {
        console.log(response);
        this.roles = response.event.eventData.tenantRoles
        this.roles.forEach(data => {
          this.time = data.createdBy.ts
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
        });
      },
      error => {
        console.error('Error:', error);
      }
    )
  }
  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(AddFormComponent,{
        data:{
            title : 'Add Role'
        },
        width: '40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Implement delete functionality here
        console.log('User deleted');
      }
    });
  }
}
