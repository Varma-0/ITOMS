import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface TerminalElement {
  sn: string;
  model: string;
  status: string;
  onlineStatus: string;
  activationTime: string;
  selected?: boolean;
}

const ELEMENT_DATA: TerminalElement[] = [
  { sn: 'JCA100615093', model: 'SP630 ECR', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'PLB400003968', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'PLB400003945', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'JC9500232565', model: 'SP630 Pro', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'JCA100615093', model: 'SP630 ECR', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'PLB400003968', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'PLB400003945', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'JC9500232565', model: 'SP630 Pro', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'JCA100615093', model: 'SP630 ECR', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'PLB400003968', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'PLB400003945', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'JC9500232565', model: 'SP630 Pro', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'JCA100615093', model: 'SP630 ECR', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'PLB400003968', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'PLB400003945', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'JC9500232565', model: 'SP630 Pro', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'JCA100615093', model: 'SP630 ECR', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'PLB400003968', model: 'P180', status: 'Online', onlineStatus: 'Online', activationTime: 'N/A' },
  { sn: 'PLB400003945', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'JC9500232565', model: 'SP630 Pro', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'JCA100615093', model: 'SP630 ECR', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'PLB400003968', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'PLB400003945', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  { sn: 'JC9500232565', model: 'SP630 Pro', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },

  // Add more rows as needed
];

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'sn', 'model', 'status', 'onlineStatus', 'activationTime', 'actions'];
  dataSource = new MatTableDataSource<TerminalElement>(ELEMENT_DATA);
  statusOptions: Array<string> = [];
  modelOptions: Array<string> = [];
  searchSn: string = '';
  searchStatus: string = '';
  searchModel: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter() {
    const filterValue = {
      sn: this.searchSn.trim().toLowerCase(),
      status: this.searchStatus.trim().toLowerCase(),
      model: this.searchModel.trim().toLowerCase(),
    };

    this.dataSource.filterPredicate = (data: TerminalElement, filter: string): boolean => {
      const filterObject = JSON.parse(filter);
      return (
        (!filterObject.sn || data.sn.toLowerCase().includes(filterObject.sn)) &&
        (!filterObject.status || data.status.toLowerCase().includes(filterObject.status)) &&
        (!filterObject.model || data.model.toLowerCase().includes(filterObject.model))
      );
    };

    this.dataSource.filter = JSON.stringify(filterValue);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Method to check if all items are selected
  isAllSelected() {
    const numSelected = this.dataSource.data.filter(element => element.selected).length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  // Method to check if some (but not all) items are selected
  isSomeSelected() {
    const numSelected = this.dataSource.data.filter(element => element.selected).length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  // Method to toggle select all or deselect all
  toggleSelectAll() {
    const isAllSelected = this.isAllSelected();
    this.dataSource.data.forEach(element => (element.selected = !isAllSelected));
  }

  // Method to handle individual checkbox change
  onCheckboxChange() {
    // This method can be used to handle any additional logic when individual checkboxes are clicked
  }

  getSelectedCount() {
    return this.dataSource.data.filter(element => element.selected).length;
  }

  edit(element: TerminalElement) {
    // Implement your edit logic here
    console.log('Edit clicked for:', element);
  }

  delete(element: TerminalElement) {
    // Implement your delete logic here
    console.log('Delete clicked for:', element);
  }
}
