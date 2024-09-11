import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { TerminalService } from 'src/app/services/terminal/devicelist';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  views = true;
  insideView = false;
  selectedDevice:any;
  columns: string[] = ['Serial Number', 'Model', 'Status'];   // 'Activation Time'
  columns1: string[] = ['Serial Number', 'Model', 'Status'];  // 'Activation Time'
  columnsVisibility = [true, true, true, true, true,true];
  filteredData: TerminalElement[] = []; // Your original data
  terminalElements: TerminalElement[] = []; // Data to display
  data: TerminalElement[] = [];
  itemsPerPageOptions = [5, 10, 15, 20];
  itemsPerPage = 5; // Default items per page
  currentPage = 1;
  paginatedDevices: TerminalElement[] = [];
  totalPages: number;
  searchText: string = '';
  selectedOption1: string = '';
  selectedOption2: string = '';
  optionStatus: string[] = [];
  optionModel: string[] = [];
  isDropdownOpen: string | null = null;

  constructor(private http: HttpClient, private terminalService: TerminalService, public dialog: MatDialog) {
    this.terminalElements = this.filteredData;
  }

  ngOnInit() {
    this.fetchData();
  }

  toggleColumn(index: number) {
    this.columnsVisibility[index] = !this.columnsVisibility[index];
  }

  clearValues() {
    this.searchText = '';
    this.selectedOption1 = '';
    this.selectedOption2 = ''
    this.applyFilter();
}

  row(individualData){
    this.selectedDevice = individualData;
    this.views = !this.views;
    this.insideView = !this.insideView;
    console.log(this.insideView,"feqqw")
    console.log("fhgssgd",individualData)
  }


  fetchData() {
    const event = new terminalEvent('DEVICE', 'SEARCH');
    const terminalRequest = new terminalBody(event);

    this.terminalService.terminalData(terminalRequest).subscribe(
      response => {
        console.log(response);
        this.data = response.event.eventData;
        this.updateOptions();
        this.updatePagination();
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  onViewChange(newView: boolean) {
    this.views = newView;
  }

  // Handler for `insideviewChange` event
  onInsideViewChange(newInsideView: boolean) {
    this.insideView = newInsideView;
  }

  updateOptions() {
    this.optionStatus = [...new Set(this.data.map(device => device.status))];
    this.optionModel = [...new Set(this.data.map(device => device.model))];
  }

  updatePagination() {
    let filteredData = this.data;
    console.log("efw",filteredData);
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
      filteredData = filteredData.filter(device => device.model === this.selectedOption2);
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
  }

  // toggleSelectAll(event: any) {
  //   const isChecked = event.target.checked;
  //   this.paginatedDevices.forEach(device => device.selected = isChecked);
  // }

  getSelectedCount() {
    return this.paginatedDevices.filter(device => device.selected).length;
  }


  applyFilter() {
    this.currentPage = 1; // Reset to first page when filtering
    this.updatePagination();
  }

  edit(element: TerminalElement) {
    console.log('Edit clicked for:', element);
  }

  openDeleteDialog(element: TerminalElement): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User deleted');
      }
    });
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
}
