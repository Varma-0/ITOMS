import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

interface Device {
  serialNumber: string;
  deviceId: string;
  model: string;
  deviceStatus: string;
  hierarchy: string;
  lastHeartbeat: string;
  groupNames: string;
  ipAddress: string;
}

interface Column {
  key: keyof Device;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
    devices: Device[] = [
    { serialNumber: '111-111-111', deviceId: '', model: 'VX 520', deviceStatus: 'PendingRegistration', hierarchy: 'BankMed', lastHeartbeat: '', groupNames: '', ipAddress: '' },
    { serialNumber: '1212121', deviceId: '0837823782378', model: '640P 1', deviceStatus: 'PendingRegistration', hierarchy: 'BankMed >> Girmiti', lastHeartbeat: '', groupNames: '', ipAddress: '' },
    { serialNumber: '237984329843289', deviceId: '0837823782378', model: '640P 2', deviceStatus: 'PendingRegistration', hierarchy: 'BankMed', lastHeartbeat: '', groupNames: '', ipAddress: '' },
    { serialNumber: '261-025-797', deviceId: '', model: 'VX 520', deviceStatus: 'Inactive', hierarchy: 'BankMed >> Girmiti', lastHeartbeat: '25/Nov/2020 09:49:...', groupNames: '', ipAddress: '192.168.1.1' },
    // Add more device data here...
  ];
  
  showColumnSelector = false;
  currentPage = 1;
  itemsPerPage = 10;

  filteredDevices: Device[] = [];
  searchTerm: string = '';
  columns: string[] = ['Serial Number', 'Device Id', 'Merchant Name', 'Merchant Hirearchy', 'Device Current Status', 'Last Connected'];
  columnsVisibility = [true, true, true, true, true,true,true,true];

  
  visibleColumns: string[] = [...this.columns];

  constructor() { }

  ngOnInit(): void {
    this.filteredDevices = [...this.devices];
  }

  applyFilter(): void {
    this.filteredDevices = this.devices.filter(device =>
      Object.values(device).some(value =>
        value.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredDevices);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Devices');
    XLSX.writeFile(wb, 'DeviceSearchReport.xlsx');
  }

  toggleColumn(index: number) {
    this.columnsVisibility[index] = !this.columnsVisibility[index];
  }

  toggleColumnSelector() {
    this.showColumnSelector = !this.showColumnSelector;
  }

  isColumnVisible(column: string): boolean {
    return this.visibleColumns.includes(column);
  }

  get totalItems(): number {
    return this.devices.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  goToFirstPage() {
    this.currentPage = 1;
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
  }
}
