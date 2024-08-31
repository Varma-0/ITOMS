// import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { Router } from '@angular/router';
// import { TerminalService } from 'src/app/services/terminal/devicelist';
// import { terminalEvent } from 'src/app/services/terminal/body/event-data';
// import { terminalBody } from 'src/app/services/terminal/body/body';
// import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
// import { MatDialog } from '@angular/material/dialog';

// export interface TerminalElement {
//   sn: string;
//   model: string;
//   status: string;
//   onlineStatus: string;
//   activationTime: string;
//   selected?: boolean;
// }


// @Component({
//   selector: 'app-terminal',
//   templateUrl: './terminal.component.html',
//   styleUrls: ['./terminal.component.scss']
// })
// export class TerminalComponent implements OnInit, AfterViewInit {
//   displayedColumns: string[] = ['select', 'sn', 'model', 'status', 'onlineStatus', 'activationTime', 'actions'];
//   ELEMENT_DATA: TerminalElement[];
//   dataSource = new MatTableDataSource<TerminalElement>(this.ELEMENT_DATA);
//   statusOptions: Array<string> = [];
//   modelOptions: Array<string> = [];
//   searchSn: string = '';
//   searchStatus: string = '';
//   searchModel: string = '';

//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   constructor(private terminalService: TerminalService, private router: Router,public dialog: MatDialog) {}


//   ngOnInit() {
//     const event = new terminalEvent('DEVICE', 'SEARCH');
//     const terminalRequest = new terminalBody(event);
    
//     this.terminalService.terminalData(terminalRequest).subscribe(
//       response => {
//         console.log(response);
//         this.ELEMENT_DATA = response.event.eventdata
//       },
//       error => {
//         console.error('Error:', error);
//       }
//     );
//   }

//   ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//   }

//   applyFilter() {
//     const filterValue = {
//       sn: this.searchSn.trim().toLowerCase(),
//       status: this.searchStatus.trim().toLowerCase(),
//       model: this.searchModel.trim().toLowerCase(),
//     };

//     this.dataSource.filterPredicate = (data: TerminalElement, filter: string): boolean => {
//       const filterObject = JSON.parse(filter);
//       return (
//         (!filterObject.sn || data.sn.toLowerCase().includes(filterObject.sn)) &&
//         (!filterObject.status || data.status.toLowerCase().includes(filterObject.status)) &&
//         (!filterObject.model || data.model.toLowerCase().includes(filterObject.model))
//       );
//     };

//     this.dataSource.filter = JSON.stringify(filterValue);

//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//   }

//   // Method to check if all items are selected
//   isAllSelected() {
//     const numSelected = this.dataSource.data.filter(element => element.selected).length;
//     const numRows = this.dataSource.data.length;
//     return numSelected === numRows;
//   }

//   // Method to check if some (but not all) items are selected
//   isSomeSelected() {
//     const numSelected = this.dataSource.data.filter(element => element.selected).length;
//     const numRows = this.dataSource.data.length;
//     return numSelected > 0 && numSelected < numRows;
//   }

//   // Method to toggle select all or deselect all
//   toggleSelectAll() {
//     const isAllSelected = this.isAllSelected();
//     this.dataSource.data.forEach(element => (element.selected = !isAllSelected));
//   }

//   // Method to handle individual checkbox change
//   onCheckboxChange() {
//     // This method can be used to handle any additional logic when individual checkboxes are clicked
//   }

//   getSelectedCount() {
//     return this.dataSource.data.filter(element => element.selected).length;
//   }

//   edit(element: TerminalElement) {
//     // Implement your edit logic here
//     console.log('Edit clicked for:', element);
//   }
//   openDeleteDialog(element: any): void {
//     const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
//       data: { element } // Pass data to the dialog if needed
//     });
  
//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         // Implement delete functionality here
//         console.log('User deleted');
//       }
//     });
//   }
  
// }

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
  columns: string[] = ['Serial Number', 'Model', 'Status', 'Online Status', 'Activation Time', 'Actions'];
  columns1: string[] = ['Serial Number', 'Model', 'Status', 'Online Status', 'Activation Time'];
  columnsVisibility = [true, true, true, true, true];
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
        (device.serialNumber && device.serialNumber.toLowerCase().includes(this.searchText.toLowerCase()))
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

  // toggleSelectAll(event: Event) {
  //   const isChecked = (event.target as HTMLInputElement).checked;
  //   this.data.forEach(device => {
  //     device.selected = isChecked;
  //   });
  // }

  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;
    this.paginatedDevices.forEach(device => device.selected = isChecked);
  }
  
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
