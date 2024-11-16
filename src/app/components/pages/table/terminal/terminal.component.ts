import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { TerminalService } from 'src/app/services/terminal/devicelist';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedServices } from 'src/app/services/shared.service';
import { ExcelService } from 'src/app/services/excel.service';

export interface TerminalElement {
  serialNumber: string;
  model: string;
  status: string;
  onlineStatus: string;
  activationTime: string;
  selected?: boolean;
}

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  views = true;
  insideView = false;
  selectedDevice:any;
columns = [
    { name: 'Serial Number', visible: true },
    { name: 'Model', visible: true },
    { name: 'Status', visible: true },
  ];
  filteredData: TerminalElement[] = []; // Your original data
  terminalElements: TerminalElement[] = []; // Data to display
   selectedDevices: TerminalElement[] = [];
  data: TerminalElement[] = [];
  itemsPerPageOptions = [5, 10, 15, 20];
  itemsPerPage = 5; // Default items per page
  currentPage = 1;
  paginatedDevices: TerminalElement[] = [];
  totalPages: number;
  searchText: string = '';
  selectedOption1: string = '';
  selectedOption2: string = '';
  optionStatus: string[] = ['ACTIVE','BLOCK'];
  optionModel: string[] = [];
  isDropdownOpen: string | null = null;
  excelData: any[] = [];
  headers: string[] = [];
  missingColumns: any[] = [];
  requiredColumns = []

  constructor(private http: HttpClient, private terminalService: TerminalService, public dialog: MatDialog, private shared: SharedServices,private excelService: ExcelService,private dataService:TerminalService) {
    this.terminalElements = this.filteredData;
  }

  ngOnInit() {
    this.fetchData();
  }

  toggleColumn(index: number) {
    this.columns[index].visible = !this.columns[index].visible;
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
      this.uploadBulkTerminals();
    } catch (error) {
      this.shared.showError(error.message); // Handle error
    } finally {
      // Reset the file input value
      this.fileInput.nativeElement.value = ''; // Reset the input field
      this.missingColumns = [];
    }
  }

  uploadBulkTerminals() {
    const payload = {
      "event": {
          "eventData": this.excelData,
          "eventType": "TERMINAL",
          "eventSubType": "CREATE"
      }
    }
    this.shared.showLoader.next(true);
    this.dataService.terminalBulkUpload(payload).subscribe(
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

  clearValues() {
    this.searchText = '';
    this.selectedOption1 = '';
    this.selectedOption2 = ''
    this.applyFilter();
}

row(individualData){
    this.terminalViewData(individualData)
  }


  fetchData() {
    const event = new terminalEvent('DEVICE', 'SEARCH');
    const terminalRequest = new terminalBody(event);

    this.terminalService.terminalData(terminalRequest).subscribe(
      response => {
        this.data = response.event.eventData;
        this.updateOptions();
        this.updatePagination();
      },
      error => {
      }
    );
  }

  terminalViewData(individualData) {
    const payload = {
      "event": {
        "eventData":individualData.id,
        "eventType": "REPORT",
        "eventSubType": "SEARCH"
      }
    }
    this.shared.showLoader.next(true);
    this.terminalService.getTerminalReport(payload).subscribe(
      reponse => {
        const data = reponse.event.eventData
        this.shared.setEventData(data);
        this.shared.showLoader.next(false);
        this.selectedDevice = individualData;
        this.views = !this.views;
        this.insideView = !this.insideView;
      },
      error => {
        this.shared.showLoader.next(false);
        this.shared.showError(error.message)
      }
    )
  }

  onViewChange(newView: boolean) {
    this.views = newView;
  }

  // Handler for `insideviewChange` event
  onInsideViewChange(newInsideView: boolean) {
    this.insideView = newInsideView;
  }

  updateOptions() {
    // this.optionStatus = [...new Set(this.data.map(device => device.status))];
    this.optionModel = [...new Set(this.data.map(device => device['modelName']))];
  }

  updatePagination() {
    let filteredData = this.data;
    if (this.searchText) {
      filteredData = filteredData.filter(device =>
        (device.serialNumber && device.serialNumber?.toLowerCase().includes(this.searchText?.toLowerCase()))
      );
    }

    if (this.selectedOption1) {
      filteredData = filteredData.filter(device => device.status === this.selectedOption1);
    }

    // Filter by model if selected
    if (this.selectedOption2) {
      filteredData = filteredData.filter(device => device['modelName'] === this.selectedOption2);
    }

    // Update the terminalElements to display the filtered data
    this.terminalElements = filteredData;


    this.totalPages = Math.ceil(filteredData.length / this.itemsPerPage);
    this.paginatedDevices = filteredData.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  clearOption1() {
    this.selectedOption1 = ''; // Clear the selection
    this.applyFilter(); // Reapply the filter
  }

  clearOption2() {
    this.selectedOption2 = ''; // Clear the selection
    this.applyFilter(); // Reapply the filter
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.data.forEach(device => {
      device.selected = isChecked;
    });
    this.updateSelectedDevices();
  }

  updateSelectedDevices() {
    this.selectedDevices = this.data.filter(device => device.selected);
  }

  // Adjust existing toggleSelect method to update selected devices
  toggleDeviceSelection(device: TerminalElement) {
    device.selected = !device.selected;
    this.updateSelectedDevices();
  }



  getSelectedCount() {
    return this.paginatedDevices.filter(device => device.selected).length;
  }

  getStatusByDisbale() {
    this.paginatedDevices.filter(device=>device)
  }

  blockSelectedRow() {
    const devicesToBlock = this.selectedDevices.filter(device => device.status !== 'BLOCK');
    if (devicesToBlock.length) {
      const deviceIds = devicesToBlock.map(device => device['id']);
      const payload = {
        "event": {
            "eventData": deviceIds,
            "eventType": "DEVICE",
            "eventSubType": "BLOCK"
        }
      }
      this.terminalService.blockTerminal(payload).subscribe(
        response => {
          this.updateOptions();
          this.updatePagination();
          this.shared.showSuccess("Terminal Blocked Successfully");
          this.fetchData();
        },
        error => {
          this.shared.showError(error.message)
        }
      )
      // Call your block service or perform necessary action here with selectedDevices
    }
  }

  unblockSelectedRow() {
    const devicesToUnBlock = this.selectedDevices.filter(device => device.status !== 'ACTIVE');
    if (devicesToUnBlock.length) {
      const deviceIds = devicesToUnBlock.map(device => device['id']);
      const payload = {
        "event": {
            "eventData":  deviceIds,
            "eventType": "DEVICE",
            "eventSubType": "UNBLOCK"
        }
      }
      this.terminalService.blockTerminal(payload).subscribe(
        response => {
          this.updateOptions();
          this.updatePagination();
          this.shared.showSuccess("Terminal Unblocked Successfully");
          this.fetchData();
        },
        error => {
          this.shared.showError(error.message)
        }
      )
      // Call your block service or perform necessary action here with selectedDevices
    }
  }

  addToGroup() {

  }

  updateItemsPerPage(): void {
    this.currentPage = 1;
    this.updatePagination();
}

  applyFilter() {
    this.currentPage = 1; // Reset to first page when filtering
    this.updatePagination();
  }

  edit(element: TerminalElement) {
  }

  openDeleteDialog(element: TerminalElement): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
}
