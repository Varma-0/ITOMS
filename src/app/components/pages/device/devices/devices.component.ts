import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { DevicesFormComponent } from 'src/app/components/dialogs/device-form/device-form.component';
import { updateDevice } from 'src/app/services/login/body/body';
import { updateDeviceEvent } from 'src/app/services/login/body/event';
import { createDevice } from 'src/app/services/login/body/event-data';
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
  modelsList: any = [];
  time: any = '';
  fulldate:any = '';
  day:any = '';
  date: any='';
  month: any = '';
  loginData: any;
  isActive: boolean;
  filteredDevices = this.device;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  itemsPerPageOptions = [5, 10, 15];
  paginatedDevices = [];
  merchants = [];

  constructor(public dialog: MatDialog, private dataService: TerminalService,private shared:SharedServices) {}

  ngOnInit(): void {
    this.loginData = localStorage.getItem("SA");
    console.log("uigfiqw",this.loginData);
    this.deviceData();
    this.deviceDropdown();
    this.updatePagination();
    this.getMerchants();
  }

  deviceData() {
    const event = new terminalEvent('DEVICE', 'SEARCH');
    const terminalRequest = new terminalBody(event);
    this.dataService.terminalData(terminalRequest).subscribe(
      response => {
        console.log(response);
        this.device = response.event.eventData.map(data => {
          const time = data.createdBy.ts;
          const fulldate = time.split('T')[0];  // Get the full date (YYYY-MM-DD)
          
          return {
            deviceId: data.id,
            serialNumber: data.serialNumber,
            model: data.model,
            status: data.status,
            fulldate: fulldate,
            sk: data.softwareKey,
            hierarchy: data.hierarchy
          };
        });
        // this.filteredDevices = this.device;
        this.search();
        // this.paginatedDevices = this.device;
    
        // Log the updated device array
        console.log('Updated device data:', this.device);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  deviceDropdown() {
    const event = new terminalEvent('MODEL', 'SEARCH');
    const terminalRequest = new terminalBody(event);
    this.dataService.modelData(terminalRequest).subscribe(
      response => {
        console.log(response);
        this.device = response.event.eventData.map(data => {
          const time = data.createdBy.ts;
          const fulldate = time.split('T')[0];  // Get the full date (YYYY-MM-DD)
          this.modelsList.push(
            {name:data.name,
            id:data.id}
          );
          return {
            modelId: data.id,
            name: data.name,
            description: data.description,
            fulldate: fulldate,
            
          };
        });
        // this.filteredDevices = this.device;
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
    this.updatePagination();
  }

  getMerchants(){
    const event = new terminalEvent('MERCHANT', 'SEARCH');
    const merchantRequest = new terminalBody(event);
    this.dataService.merchantData(merchantRequest).subscribe(
      response => {
        this.merchants = response.event.eventData
      },
      error => {
        console.error('Error:', error);
      }
    )
  }

  
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredDevices.length / this.itemsPerPage);
    this.currentPage = 1;
    this.paginate();
  }

  paginate() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDevices = this.filteredDevices.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }


  openDeleteDialog(device): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
      }
    });
  }


  openCreateDialog(data?,edit?): void {
    console.log("checking",data);
    const dialogRef = this.dialog.open(DevicesFormComponent,{
     data : {
        title : edit ? 'Edit Device' : 'Add Device',
        // hierarchy : ['Test','New','Ok'],
        modals : this.modelsList,
        merchants : this.merchants,
        form:{
            sno: data.serialNumber,
            skey: data.sk,
            modal: data.model,
            hierarchy: data.hierarchy,
        }
     },
     width : '40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       if(edit) {
        const event = new createDevice(data.deviceId,result.sno, result.modal,data.hierarchy);
        const terminalRequest = new updateDeviceEvent(event,'DEVICE','UPDATE');
        const editDevice = new updateDevice(terminalRequest);
        console.log("cwicw",editDevice);
        this.dataService.updateDevice(editDevice).subscribe(
          response => {
            console.log(response);
            this.deviceData();
          },
          error => {
            console.error('Error:', error);
          }
        );
       }
      }
    });
  }

}
