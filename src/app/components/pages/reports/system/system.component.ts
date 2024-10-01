import { Component, OnInit } from '@angular/core';
import { TerminalService } from 'src/app/services/terminal/devicelist';
import * as XLSX from 'xlsx';

interface Device {
    eventType: string;
    eventSubType: string;
    message: string;
    userName: string;
    auditTime: string;
    appCode: string;
    view?:Boolean
}

interface Column {
  key: keyof Device;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemReportComponent implements OnInit {
    devices: Device[] = []

  filteredDevices: Device[] = [];
  searchTerm: string = '';
  columns: Column[] = [
    { key: 'auditTime', label: 'Date Changed', visible: true },
    { key: 'message', label: 'Description', visible: true },
    { key: 'appCode', label: 'Source', visible: true },
    { key: 'userName', label: 'Modified By', visible: true },
    { key: 'eventType', label: 'Entity', visible: true },
    { key: 'eventSubType', label: 'Operation', visible: true },
  ];

  currentPage = 1;
  itemsPerPage = 10;

  constructor(private dataService: TerminalService) { }

  ngOnInit(): void {
    this.getData()
  }

  getData(){
    const data = {
        "event": {
          "eventType": "REPORT",
          "eventSubType": "SEARCH"
        }
      }
    this.dataService.getAuditReport(data).subscribe(
        response => {
            console.log(response);
            this.devices = [];
            response.event.eventData.forEach(element => {
                this.devices.push({
                    'auditTime' : element.auditTime,
                    'appCode' : element.appCode,
                    'eventSubType':element.eventSubType,
                    'eventType' : element.eventType,
                    'message':element.message,
                    'userName':element.updatedBy.userName
                })
            });
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
    XLSX.writeFile(wb, 'DeviceSystemReport.xlsx');
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
