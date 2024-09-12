import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportsDialogComponent } from 'src/app/components/dialogs/reports/reports.component';
import { TerminalService } from 'src/app/services/terminal/devicelist';
import * as XLSX from 'xlsx';

interface Device {
  serialNumber: string;
  deviceId: string;
  merchantName: string;
  deviceModel: string;
  merchantHierarchy: string;
  jobStatus: string;
  groupNames: string;
  ipAddress: string;
  view?:Boolean;
  scheduledDate: any;
}

interface Column {
  key: keyof Device;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersReportComponent implements OnInit {
    devices: Device[] = [];

  filteredDevices: Device[] = [];
  searchTerm: string = '';
  columns: Column[] = [
    { key: 'serialNumber', label: 'Serial Number', visible: true },
    { key: 'deviceId', label: 'Device ID', visible: true },
    { key: 'merchantName', label: 'Merchant Name', visible: true },
    { key: 'merchantHierarchy', label: 'Merchant Hierarchy', visible: true },
    { key: 'deviceModel', label: 'Model', visible: true },
    { key: 'jobStatus', label: 'JOB Status', visible: true },
    { key: 'scheduledDate', label: 'Scheduled Date', visible: true },
  ];

  currentPage = 1;
  itemsPerPage = 10;

  constructor(private dialog:MatDialog,private dataService:TerminalService) { }

  ngOnInit(): void {
    this.applyFilter();
    this.loadParameterStatusReport();
  }

  applyFilter(): void {
    this.filteredDevices = this.devices.filter(device =>
      Object.entries(device).some(([key, value]) =>
        this.columns.find(col => col.key === key)?.visible && value != 0 &&
        value?.toLowerCase().includes(this.searchTerm?.toLowerCase())
      )
    );
  }

  loadParameterStatusReport() {
    const payload = {
      "event": {
        "eventType": "REPORT",
        "eventSubType": "SEARCH"
      }
    }
    this.dataService.getParameterReport(payload).subscribe(
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
    XLSX.writeFile(wb, 'DeviceParameterStatusReport.xlsx');
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
    this.filteredDevices = this.filteredDevices.filter(device => device.serialNumber !== null);
  
  // Return paginated data after filtering
  return this.filteredDevices.slice(this.startIndex, this.endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openReportDialog(data): void {
    const dialogRef = this.dialog.open(ReportsDialogComponent,{
        data:{
            'Package Name' : 'Test',
            'Current Version' : 'Test',
            'Deployment Version' : 'Test',
            'Download Status' : 'Test'
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Implement delete functionality here
        console.log('User deleted');
      }
    });
  }

}
