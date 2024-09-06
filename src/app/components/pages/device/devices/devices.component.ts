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
  filteredDevices = this.device;
  searchTerm = '';

  constructor(public dialog: MatDialog, private dataService: TerminalService,private shared:SharedServices) {}

  ngOnInit(): void {
    this.loginData = localStorage.getItem("SA");
    console.log("uigfiqw",this.loginData);
    const event = new terminalEvent('DEVICE', 'SEARCH');
    const terminalRequest = new terminalBody(event);
    this.dataService.terminalData(terminalRequest).subscribe(
      response => {
        console.log(response);
        this.device = response.event.eventData.map(data => {
          const time = data.createdBy.ts;
          const fulldate = time.split('T')[0];  // Get the full date (YYYY-MM-DD)
          
          return {
            serialNumber: data.serialNumber,
            model: data.model,
            status: data.status,
            fulldate: fulldate,
          };
        });
        this.filteredDevices = this.device;
    
        // Log the updated device array
        console.log('Updated device data:', this.device);
      },
      error => {
        console.error('Error:', error);
      }
    );

  }

  search() {
    this.filteredDevices = this.device.filter(devi =>
      devi.serialNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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

}
