import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportsDialogComponent } from 'src/app/components/dialogs/reports/reports.component';
import { SharedServices } from 'src/app/services/shared.service';
import { TerminalService } from 'src/app/services/terminal/devicelist';
import * as XLSX from 'xlsx';

interface Device {
    serialNumber: string;
    deviceId: string;
    merchantName: string;
    merchantHierarchy: string;
    deviceModel: string;
    view?: boolean;
  }

interface Column {
  key: keyof Device;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'app-heart',
  templateUrl: './heart.component.html',
  styleUrls: ['./heart.component.scss']
})
export class HeartReportComponent implements OnInit {
  devices: Device[] = [];
  paginatedDevicess: any[] = [];
  filteredDevices: Device[] = [];
  searchTerm: string = '';
  columns: Column[] = [
    { key: 'serialNumber', label: 'Serial Number', visible: true },
    { key: 'deviceId', label: 'Device ID', visible: true },
    { key: 'merchantName', label: 'Merchant Name', visible: true },
    { key: 'merchantHierarchy', label: 'Merchant Hierarchy', visible: true },
    { key: 'deviceModel', label: 'Model', visible: true },
    { key: 'view', label: 'View', visible: true },
  ];

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  itemsPerPageOptions = [5, 10, 15];

  constructor(public dialog: MatDialog,private dataService:TerminalService, private shared: SharedServices) { }

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
    this.shared.showLoader.next(true);
    this.dataService.getHeartReport(data).subscribe(
        response => {
          if(response.status == 200) {
            console.log(response);
            this.devices = response.event.eventData.responseData[0];
            this.applyFilter();
          }
          this.shared.showLoader.next(false);
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
    this.updatePagination();
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
    XLSX.writeFile(wb, 'DeviceHeartReport.xlsx');
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

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  get paginatedDevices(): Device[] {
    return this.filteredDevices.slice(this.startIndex, this.endIndex);
  }

  // goToPage(page: number): void {
  //   if (page >= 1 && page <= this.totalPages) {
  //     this.currentPage = page;
  //   }
  // }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredDevices.length / this.itemsPerPage);
    this.currentPage = 1;
    this.paginate();
  }

  paginate() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDevicess = this.filteredDevices.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  openReportDialog(data): void {
    console.log(data);
        const payload = {
            "event": {
              "eventData":data,
              "eventType": "REPORT",
              "eventSubType": "SEARCH"
            }
          }
        this.shared.showLoader.next(true);
        this.dataService.getHeartViewReport(payload).subscribe(
            response => {
                const dialogRef = this.dialog.open(ReportsDialogComponent,{
                    data: response.event.eventData.responseData
                });

                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    // Implement delete functionality here
                    console.log('User deleted');
                  }
                });
              this.shared.showLoader.next(false);
            },
            error => {
                console.error('Error:', error);
            }
        )
  }
}
