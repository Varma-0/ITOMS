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
  view?:Boolean
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
        { serialNumber: '111-111-111', deviceId: '', model: 'VX 520', deviceStatus: 'PendingRegistration', hierarchy: 'BankMed', lastHeartbeat: '', groupNames: '', ipAddress: '',view:true },
        { serialNumber: '1212121', deviceId: '0837823782378', model: '640P 1', deviceStatus: 'PendingRegistration', hierarchy: 'BankMed >> Girmiti', lastHeartbeat: '', groupNames: '', ipAddress: '' },
        { serialNumber: '237984329843289', deviceId: '0837823782378', model: '640P 2', deviceStatus: 'PendingRegistration', hierarchy: 'BankMed', lastHeartbeat: '', groupNames: '', ipAddress: '' },
        { serialNumber: '261-025-797', deviceId: '', model: 'VX 520', deviceStatus: 'Inactive', hierarchy: 'BankMed >> Girmiti', lastHeartbeat: '25/Nov/2020 09:49:...', groupNames: '', ipAddress: '192.168.1.1' },
        // Add more device data here...
      ];

  filteredDevices: Device[] = [];
  searchTerm: string = '';
  columns: Column[] = [
    { key: 'serialNumber', label: 'Serial Number', visible: true },
    { key: 'deviceId', label: 'Device ID', visible: true },
    { key: 'model', label: 'Merchant Name', visible: true },
    { key: 'hierarchy', label: 'Merchant Hierarchy', visible: true },
    { key: 'deviceStatus', label: 'Device Current Status', visible: true },
    { key: 'lastHeartbeat', label: 'Last Connected', visible: true },
  ];

  currentPage = 1;
  itemsPerPage = 10;

  constructor() { }

  ngOnInit(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredDevices = this.devices.filter(device =>
      Object.entries(device).some(([key, value]) =>
        this.columns.find(col => col.key === key)?.visible &&
        value?.toLowerCase().includes(this.searchTerm?.toLowerCase())
      )
    );
  }

  exportToExcel(): void {
    const visibleData = this.filteredDevices.map(device =>
      this.columns.reduce((acc, col) => {
        if (col.visible) {
          acc[col.label] = device[col.key];
        }
        return acc;
      }, {} as Partial<Device>)
    );

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(visibleData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Devices');
    XLSX.writeFile(wb, 'DeviceSearchReport.xlsx');
  }

  toggleColumn(column: Column): void {
    column.visible = !column.visible;
    this.applyFilter();
  }

  get visibleColumns(): Column[] {
    return this.columns.filter(col => col.visible);
  }

  get totalItems(): number {
    return this.filteredDevices.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  get paginatedDevices(): Device[] {
    return this.filteredDevices.slice(this.startIndex, this.endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
