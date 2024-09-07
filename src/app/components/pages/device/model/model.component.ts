import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { DevicesFormComponent } from 'src/app/components/dialogs/device-form/device-form.component';
import { createBody, emailBody } from 'src/app/services/login/body/body';
import { createModelEvent, deleteModelEvent, emailEvent, updateModelEvent } from 'src/app/services/login/body/event';
import { createData, modelUpdateData } from 'src/app/services/login/body/event-data';
import { SharedServices } from 'src/app/services/shared.service';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';

// interface FileItem {
//   name: string;
//   type: string;
//   size: string;
//   date: string;
//   isDirectory: boolean;
//   isSelected: boolean;
// }

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrl: './model.component.scss'
})
export class ModelComponent implements OnInit {
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
    this.fetchData();
  }

  fetchData() {
    const event = new terminalEvent('MODEL', 'SEARCH');
    const terminalRequest = new terminalBody(event);
    this.dataService.modelData(terminalRequest).subscribe(
      response => {
        console.log(response);
        this.device = response.event.eventData.map(data => {
          const time = data.createdBy.ts;
          const fulldate = time.split('T')[0];  // Get the full date (YYYY-MM-DD)
          this.shared.modelsList = data.name;
          return {
            modelId: data.id,
            name: data.name,
            description: data.description,
            fulldate: fulldate,
          };
        });
        this.filteredDevices = this.device;
        console.log('Updated device data:', this.device);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  search() {
    this.filteredDevices = this.device.filter(devi =>
      devi.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


  openCreateDialog(data?,edit?): void {
    const dialogRef = this.dialog.open(DevicesFormComponent,{
     data : {
        title : edit ? 'Edit Model' : 'Add Model',
        form:{
            name: data.name,
            description: data.description,
        }
     },
     width : '40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(edit) {
          const updateModelRequest = new modelUpdateData(data.modelId,data.name,data.description);
          const event = new updateModelEvent(updateModelRequest,'MODEL', 'CREATE');
          console.log("response",event)
          this.dataService.updateModel(event).subscribe(
            response => {
              console.log("response",response)
            }
          );
        }
        else if(!edit) {
          const eventData = new createData(result.name,result.description);
          const createModel = new createModelEvent(eventData,'MODEL', 'CREATE');
          const create = new createBody(createModel);
          console.log("responseCreate",createModel)
          this.dataService.createModel(create).subscribe(
            response => {
              console.log("responseCreate",response)
              this.fetchData();
            }
          );
        }
      }
    });
  }

  openDeleteDialog(device): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const event = new deleteModelEvent(device.modelId,'MODEL', 'DELETE');
        console.log("response",event)
        this.dataService.deleteModel(event).subscribe(
          response => {
            console.log("response",response)
          }
        );
      }
    });
  }
  // files: FileItem[] = [
  //   { name: 'filestorages', type: 'Directory', size: '', date: '', isDirectory: true, isSelected: false },
  //   { name: 'FNB POS', type: 'Directory', size: '', date: '07/29/2024 13:51:18', isDirectory: true, isSelected: false },
  //   { name: 'Blank_1x1 (1).png', type: 'png', size: '120.000 Byte', date: '04/09/2024 18:05:10', isDirectory: false, isSelected: false },
  //   { name: 'Newland_L3_configuration...', type: 'xml', size: '61.025 KB', date: '06/07/2024 15:16:05', isDirectory: false, isSelected: false },
  //   { name: 'bg.png', type: 'png', size: '354.237 KB', date: '06/18/2024 20:21:12', isDirectory: false, isSelected: false },
  //   { name: 'get_paid.png', type: 'png', size: '12.243 KB', date: '06/18/2024 20:20:50', isDirectory: false, isSelected: false },
  //   { name: 'get_paid_active.png', type: 'png', size: '11.841 KB', date: '06/18/2024 20:21:03', isDirectory: false, isSelected: false },
  //   { name: 'get_paid_inactive.png', type: 'png', size: '10.688 KB', date: '06/18/2024 20:20:57', isDirectory: false, isSelected: false },
  //   { name: 'idleImage.png', type: 'png', size: '354.237 KB', date: '07/16/2024 15:02:55', isDirectory: false, isSelected: false },
  //   { name: 'stockpay.png', type: 'png', size: '26.626 KB', date: '06/18/2024 20:21:38', isDirectory: false, isSelected: false },
  //   { name: 'stockpay_active.png', type: 'png', size: '31.887 KB', date: '06/18/2024 20:21:20', isDirectory: false, isSelected: false },
  //   { name: 'stockpay_inactive.png', type: 'png', size: '18.712 KB', date: '06/18/2024 20:21:30', isDirectory: false, isSelected: false },
  // ];

  // filteredFiles: FileItem[] = [];
  // paginatedFiles: FileItem[] = [];
  // searchTerm: string = '';
  // currentPage: number = 1;
  // pageSize: number = 10;
  // totalPages: number = 1;
  // hasSelection: boolean = false;

  // ngOnInit() {
  //   this.filteredFiles = this.files;
  //   this.updatePagination();
  // }

  // applyFilter() {
  //   this.filteredFiles = this.files.filter(file => 
  //     file.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  //   this.currentPage = 1;
  //   this.updatePagination();
  // }

  // updatePagination() {
  //   this.totalPages = Math.ceil(this.filteredFiles.length / this.pageSize);
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   this.paginatedFiles = this.filteredFiles.slice(startIndex, startIndex + this.pageSize);
  // }

  // prevPage() {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //     this.updatePagination();
  //   }
  // }

  // nextPage() {
  //   if (this.currentPage < this.totalPages) {
  //     this.currentPage++;
  //     this.updatePagination();
  //   }
  // }

  // updateSelection() {
  //   this.hasSelection = this.files.some(file => file.isSelected);
  // }


  // toggleAllSelection(event: any) {
  //   const isChecked = event.target.checked;
  //   this.paginatedFiles.forEach(file => file.isSelected = isChecked);
  //   this.updateSelection();
  // }

  // onRefresh() {
  //   console.log('Refresh clicked');
  //   // Implement refresh logic
  // }

  // onDelete() {
  //   console.log('Delete clicked');
  //   // Implement delete logic
  // }

  // onDownload() {
  //   console.log('Download clicked');
  //   // Implement download logic
  // }

  // onUpload() {
  //   console.log('Upload clicked');
  //   // Implement upload logic
  // }
}
