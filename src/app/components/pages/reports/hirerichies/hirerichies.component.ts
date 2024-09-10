import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

interface Device {
    name: string;
    path: string;
    description: string;
    ipStartAddress: string;
    ipEndAddress: string;
    locationIdentifier: string;
    timeZone: string;
}

interface Column {
  key: keyof Device;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'app-hirerichies',
  templateUrl: './hirerichies.component.html',
  styleUrls: ['./hirerichies.component.scss']
})
export class HirerichiesReportComponent implements OnInit {
    devices: Device[] = [];

  filteredDevices: Device[] = [];
  searchTerm: string = '';
  columns: Column[] = [
    { key: 'name', label: 'Hierarchy Name', visible: true },
    { key: 'path', label: 'Full Path', visible: true },
    { key: 'description', label: 'Description', visible: true },
    { key: 'ipStartAddress', label: 'IP Start Range', visible: true },
    { key: 'ipEndAddress', label: 'IP End Range', visible: true },
    { key: 'locationIdentifier', label: 'Location ID', visible: true },
    { key: 'timeZone', label: 'Time Zone', visible: true },
  ];

  currentPage = 1;
  itemsPerPage = 10;

  constructor() { }

  ngOnInit(): void {
    this.devices = JSON.parse(localStorage.getItem('hier'));
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredDevices = this.devices.filter(device =>
      Object.entries(device).some(([key, value]) =>
        this.columns.find(col => col.key === key)?.visible && value != 0 &&
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
