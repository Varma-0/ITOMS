import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DevicesFormComponent } from 'src/app/components/dialogs/device-form/device-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { createBody, deleteBody, updateBody } from 'src/app/services/login/body/body';
import { createModelEvent, deleteModelEvent, updateModelEvent } from 'src/app/services/login/body/event';
import { createData, modelUpdateData } from 'src/app/services/login/body/event-data';
import { SharedServices } from 'src/app/services/shared.service';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit {
  devices: any[] = [];
  filteredDevices: any[] = [];
  paginatedDevices: any[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  itemsPerPageOptions = [5, 10, 15];
  columns = [
    { name: 'Device Model', visible: true },
    { name: 'OEM', visible: true },
    { name: 'Description', visible: true },
    { name: 'Created Date', visible: true },
  ];

  toggleColumn(index: number): void {
    this.columns[index].visible = !this.columns[index].visible;
  }

  constructor(
    public dialog: MatDialog,
    private dataService: TerminalService,
    private shared: SharedServices
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    const event = new terminalEvent('MODEL', 'SEARCH');
    const terminalRequest = new terminalBody(event);
    this.dataService.modelData(terminalRequest).subscribe(
      response => {
        this.devices = response.event.eventData.map(data => ({
          modelId: data.id,
          name: data.name,
          oem: data.oem,
          description: data.description,
          fulldate: data.createdBy.ts.split('T')[0],
          delete: data.delete
        }));
        this.shared.modelsList = this.devices.map(device => device.name);
        this.search();
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  search() {
    this.filteredDevices = this.devices.filter(device =>
      device.name?.toLowerCase().includes(this.searchTerm?.toLowerCase())
    );
    this.updatePagination();
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

  openCreateDialog(data?: any, edit = false): void {
    const dialogRef = this.dialog.open(DevicesFormComponent, {
      data: {
        title: edit ? 'Edit Model' : 'Add Model',
        form: {
          name: data?.name || '',
          description: data?.description || '',
        }
      },
      width: '40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (edit) {
          this.updateModel(data.modelId, result);
        } else {
          this.createModel(result);
        }
      }
    });
  }

  updateModel(modelId: string, formData: any) {
    const updateModelRequest = new modelUpdateData(modelId, formData.name, formData.description,formData.oem);
    const event = new updateModelEvent(updateModelRequest, 'MODEL', 'CREATE');
    const update = new updateBody(event);

    this.dataService.updateModel(update).subscribe(
      response => {
        console.log("Update response", response);
        this.fetchData();
      }
    );
  }

  createModel(formData: any) {
    const eventData = new createData(formData.name, formData.description,formData.oem);
    const createModel = new createModelEvent(eventData, 'MODEL', 'CREATE');
    const create = new createBody(createModel);

    this.dataService.createModel(create).subscribe(
      response => {
        console.log("Create response", response);
        this.fetchData();
      }
    );
  }

  openDeleteDialog(device: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteModel(device.modelId);
      }
    });
  }

  deleteModel(modelId: string) {
    const event = new deleteModelEvent(modelId, 'MODEL', 'DELETE');
    const deleteRequest = new deleteBody(event);

    this.dataService.deleteModel(deleteRequest).subscribe(
      response => {
        console.log("Delete response", response);
        this.fetchData();
      }
    );
  }
}
