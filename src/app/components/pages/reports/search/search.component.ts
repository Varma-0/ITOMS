import { Component, OnInit } from '@angular/core';
import { TerminalService } from 'src/app/services/terminal/devicelist';
import * as XLSX from 'xlsx';

interface Device {
    serialNumber: string;
    deviceId: string;
    merchantName: string;
    merchantHierarchy: string;
    deviceModel: string;
    deviceCurrentStatus: string;
    lastHeartBeat: string;
    orgId: string;
    osVersion: string;
    batteryStatus: string;
  }  

interface Column {
  key: keyof Device;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchReportComponent implements OnInit {
    devices: Device[] = [];

  filteredDevices: Device[] = [];
  searchTerm: string = '';
  columns: Column[] = [
    { key: 'serialNumber', label: 'Serial Number', visible: true },
    { key: 'deviceId', label: 'Device ID', visible: true },
    { key: 'merchantName', label: 'Merchant Name', visible: true },
    { key: 'merchantHierarchy', label: 'Merchant Hierarchy', visible: true },
    { key: 'deviceModel', label: 'Model', visible: true },
    { key: 'deviceCurrentStatus', label: 'Device Current Status', visible: true },
    { key: 'lastHeartBeat', label: 'Last Heart Beat', visible: true },
    { key: 'orgId', label: 'Org ID', visible: true },
    { key: 'osVersion', label: 'OS Vresion Details', visible: true },
    { key: 'batteryStatus', label: 'Battery Status', visible: true },
  ];

  currentPage = 1;
  itemsPerPage = 10;

  constructor(private dataService: TerminalService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    const data = {
        "event": {
          "eventType": "REPORT",
          "eventSubType": "SEARCH"
        }
      }
    this.dataService.getSearchReport(data).subscribe(
        response => {
            console.log(response);
            this.devices = response.event.eventData.responseData[0];
            this.applyFilter();
        },
        error => {
            console.error('Error:', error);
        }
    )
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
