import { Component, ViewChild,ElementRef, OnInit } from '@angular/core';
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
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
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
  requiredColumns = ['name', 'oem'];
  excelData: any[] = [];
  missingColumns: any[] = [];
  headers: string[] = [];
  toggleColumn(index: number): void {
    this.columns[index].visible = !this.columns[index].visible;
  }

  constructor(
    public dialog: MatDialog,
    private dataService: TerminalService,
    private shared: SharedServices,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  triggerFileUpload(): void {
    this.fileInput.nativeElement.click(); // Programmatically click the hidden file input
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }
  
  async uploadFile(file: File): Promise<void> {
    try {
      const result = await this.excelService.convertExcelToJson(file, this.requiredColumns,this.missingColumns);
      this.headers = result.headers; // Store headers
      this.excelData = result.data; // Store data
    } catch (error) {
      console.error("Error:", error.message);
      this.shared.showError(error.message); // Handle error
    } finally {
      // Reset the file input value
      this.fileInput.nativeElement.value = ''; // Reset the input field
      this.missingColumns = [];
    }
  }

  uploadBulkModels() {
    const payload = {
      "event": {
          "eventData": this.excelData,
          "eventType": "MODEL",
          "eventSubType": "CREATE"
      }
    }
    this.shared.showLoader.next(true);
    this.dataService.modelBulkUpload(payload).subscribe(
      response=>{
        this.shared.showLoader.next(false);
        this.shared.showSuccess("Models Uploaded Successfully")
      },
      error => {
        this.shared.showLoader.next(false);
        this.shared.showError(error.message)
      }
    )
  }
  
  

  fetchData() {
    const event = new terminalEvent('MODEL', 'SEARCH');
    const terminalRequest = new terminalBody(event);
    this.shared.showLoader.next(true);
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
        this.shared.showLoader.next(false);
      },
      error => {
        console.error('Error:', error);
        this.shared.showLoader.next(false);
        this.shared.showError(error.message)
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
    this.shared.showLoader.next(true);
    this.dataService.updateModel(update).subscribe(
      response => {
        this.fetchData();
        this.shared.showLoader.next(false);
      },
      error => {
        console.error('Error:', error);
        this.shared.showLoader.next(false);
        this.shared.showError(error.message)
      }
    );
  }

  createModel(formData: any) {
    const eventData = new createData(formData.name, formData.description,formData.oem);
    const createModel = new createModelEvent(eventData, 'MODEL', 'CREATE');
    const create = new createBody(createModel);
    this.shared.showLoader.next(true);
    this.dataService.createModel(create).subscribe(
      response => {
        this.fetchData();
        this.shared.showLoader.next(false);
      },
      error => {
        console.error('Error:', error);
        this.shared.showLoader.next(false);
        this.shared.showError(error.message)
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
    this.shared.showLoader.next(true);
    this.dataService.deleteModel(deleteRequest).subscribe(
      response => {
        this.fetchData();
        this.shared.showLoader.next(false);
      },
      error => {
        console.error('Error:', error);
        this.shared.showLoader.next(false);
        this.shared.showError(error.message)
      }
    );
  }
}

