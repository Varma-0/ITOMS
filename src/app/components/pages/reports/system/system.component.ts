import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.service';
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
  paginatedDevicess: any[] = [];
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
  totalPages = 1;
  itemsPerPageOptions = [5, 10, 15];


  constructor(private dataService: TerminalService, private shared: SharedServices) { }

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
    this.shared.showLoader.next(true);
    this.dataService.getAuditReport(data).subscribe(
        response => {
          if(response.status == 200) {
            console.log(response);
            this.devices = [];
            response.event.eventData.forEach(element => {
              const auditDate = new Date(element.auditTime).toISOString().split('T')[0];
                this.devices.push({
                    'auditTime' : auditDate,
                    'appCode' : element.appCode,
                    'eventSubType':element.eventSubType,
                    'eventType' : element.eventType,
                    'message':element.message,
                    'userName':element.updatedBy.userName
                })
            });
            this.applyFilter();
          }
          this.shared.showLoader.next(false);
        },
        error => {
          this.shared.showLoader.next(false);
          console.error('Error:', error);
          this.shared.showError(error.message)
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
}
