import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedServices } from 'src/app/services/shared.service';
import { TerminalService } from 'src/app/services/terminal/devicelist';


export interface AppData {
  app: string;
  packageName: string;
  applicationInstallationInfo: string;
  parameterFileVersion: string;
  parameterFileStatus: string;
  publish: string;
  operation: string;
}

interface DeviceCommand {
  commandStatus: string;
  deviceCommands: string;
  ts: string;
}

interface EstateLifecycle {
  deviceId: string;
  estateType: string;
  ts: string;
}

@Component({
  selector: 'app-terminal-view',
  templateUrl: './terminal-view.component.html',
  styleUrl: './terminal-view.component.scss'
})
export class TerminalViewComponent {
  @Input() device: any;
  @Input() view: any;
  @Input() insideview: any;
  @Output() viewChange = new EventEmitter<boolean>();
  @Output() insideviewChange = new EventEmitter<boolean>();
  @ViewChild('commandPaginator') commandPaginator!: MatPaginator;
  @ViewChild('estatePaginator') estatePaginator!: MatPaginator;

  commandColumns: string[] = ['date', 'command', 'status', 'info'];
  currentPage: number = 1;
  itemsPerPage: number = 5; // Default items per page
  itemsPerPageOptions: number[] = [5, 10, 20]; // Options for items per page
  totalItems: number = 0; // Total number of items
  totalPages: number = 0;
  currentPageEstate: number = 1;
  itemsPerPageEstate: number = 5; // Default items per page
  itemsPerPageOptionsEstate: number[] = [5, 10, 20]; // Options for items per page
  totalItemsEstate: number = 0; // Total number of items
  totalPagesEstate: number = 0;
  paginatedDataSource: any[] = [];
  estateColumns: string[] = ['action', 'date'];
  data = []
  commandDataSource = new MatTableDataSource<DeviceCommand>([]);
  estateDataSource = new MatTableDataSource<EstateLifecycle>([]);
  selectedTab: string = 'overview';
  selectedTabApp:string =  'deployment';
  selectedTabRemote:string = 'diagnosis';
  selectedTabInSettings:string = 'Basic Settings'
  toggleText: string = 'Off';
  contentCondition: string = 'Device'; // Default content condition
  displayedColumns: string[] = ['app', 'packageName', 'applicationInstallationInfo', 'parameterFileVersion', 'parameterFileStatus', 'publish', 'operation'];
  dataSource: AppData[] = [
    { app: 'NEDBANK POS', packageName: 'com.ar.nedbankpos', applicationInstallationInfo: 'Installed/In Deployment', parameterFileVersion: '1.0.0', parameterFileStatus: 'Pending publish', publish: '', operation: '' }
    // Add more data objects as needed
  ];
  lists = [
    {icon:'build',header: 'Basic Settings'},
    {icon:'link',header: 'Connect Settings'},
    {icon:'tune',header: 'APN Settings'},
    {icon:'lock',header: 'Payment Modules'},
    {icon:'battery_full',header: 'Battery'},
  ]
  cards = [];
  applicationActivity: any;
  cardMethodStatisticsData: any;
  colors: string[] = [
    '#4682B4',  // Dark Blue
    '#00FFFF',  // Teal
    '#90EE90',  // Light Gray
  ];
  creationTime = '';
  cards_remote = [
    {
      title: 'Hardware Diagnostics',
      description: 'You can send a remote command to start the diagnostics tool and run it either automatically or manually.',
      icon: 'gps_fixed',
      executionTime: '',
      isActive: false
    },
    {
      title: 'Real-Time Log',
      description: 'You can remotely monitor the log of the device in real-time.',
      icon: 'show_chart',
      executionTime: '',
      isActive: false
    },
    {
      title: 'FlyDesk',
      description: 'With merchant authorization, you can operate the device remotely.',
      icon: 'cloud',
      executionTime: '',
      isActive: false
    },
    {
      title: 'Extract Log',
      description: 'Extract device\'s logs in time range.',
      icon: 'assignment',
      executionTime: '',
      isActive: false
    },
    {
      title: 'Monitor Memory',
      description: 'You can monitor terminal memory in real time or collect future terminal memory.',
      icon: 'memory',
      executionTime: '',
      isActive: false
    },
    {
      title: 'Fetch Files',
      description: 'Fetch terminal files through TOMS.',
      icon: 'folder',
      executionTime: '',
      isActive: false
    }
  ];
  latitude: any;
  latestData:any;
  longitude: any;
  labelsm: string[] = ['Contactless Card','Swipe Card','Contact Card'];
  seriesm: number[]= [0,0,0];
  datesArray: string[];
  valuesArray: unknown[];
  lastBootTime: any;
  constructor( private terminalService: TerminalService, private shared: SharedServices) {}
  ngOnInit() {
    this.shared.eventData$.subscribe(data => {
      this.latestData = data;
      this.fetchData();
    });
    // this.latestData = this.shared.getTerminalViewData();



    this.commandDataSource = new MatTableDataSource(this.latestData.deviceCommandHistory);
    this.totalItems = this.commandDataSource.data.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updatePagination();
    this.estateDataSource = new MatTableDataSource(this.latestData.lifeCycleHistories);
    this.totalItemsEstate = this.estateDataSource.data.length;
    this.totalPagesEstate = Math.ceil(this.totalItemsEstate / this.itemsPerPageEstate);
    this.updatePaginationEstate();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.commandDataSource.data = this.latestData.deviceCommandHistory.slice(startIndex, startIndex + this.itemsPerPage);
  }

  updatePaginationEstate(): void {
    const startIndex = (this.currentPageEstate - 1) * this.itemsPerPageEstate;
    this.estateDataSource.data = this.latestData.lifeCycleHistories.slice(startIndex, startIndex + this.itemsPerPageEstate);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  updateItemsPerPage() {
    this.currentPage = 1; // Reset to first page when items per page changes
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updatePagination();
  }

  nextPageEstate() {
    if (this.currentPageEstate < this.totalPagesEstate) {
      this.currentPageEstate++;
      this.updatePaginationEstate();
    }
  }

  previousPageEstate() {
    if (this.currentPageEstate > 1) {
      this.currentPageEstate--;
      this.updatePaginationEstate();
    }
  }

  updateItemsPerPageEstate() {
    this.currentPageEstate = 1; // Reset to first page when items per page changes
    this.totalPagesEstate = Math.ceil(this.totalItemsEstate / this.itemsPerPageEstate);
    this.updatePagination();
  }

  fetchData() {
    // console.log("adcgwguowe",this.latestData);
    // const payload = {
    //   "event": {
    //     "eventData":this.latestData.id,
    //     "eventType": "REPORT",
    //     "eventSubType": "SEARCH"
    //   }
    // }
    // this.shared.showLoader.next(true);
    // this.terminalService.getTerminalReport(payload).subscribe(
    //   reponse => {
    //     const data = reponse.event.eventData
        this.cards = [
          { header: 'Storage', percentage: this.latestData['storage'], icon: 'file_present' },
          { header: 'Modules', percentage: this.latestData['modules'], icon: 'view_module' },
          { header: 'Traffic', percentage: this.latestData['traffic'], icon: 'traffic' },
          { header: 'Battery', percentage: this.latestData['battery'], icon: 'battery_4_bar' }
        ];
        this.creationTime = this.latestData['deviceCreation']
        this.lastBootTime = this.latestData['lastBootTime']
        this.latitude = this.latestData['latitude']
        this.longitude = this.latestData['longitude']
        // console.log("fwww",this.latestData['cardMethodStatistics']['Contactless Card'])
        this.seriesm = [];
        this.seriesm.push(this.latestData['cardMethodStatistics']['Contactless Card'])
        this.seriesm.push(this.latestData['cardMethodStatistics']['Swipe Card'])
        this.seriesm.push(this.latestData['cardMethodStatistics']['Contact Card'])
        this.cardMethodStatisticsData = this.latestData['cardMethodStatistics']
        this.applicationActivity = this.latestData['applicationActivity']
        const entries = Object.entries(this.applicationActivity);
        // this.datesArray = entries.map(([date]) => date); // Extract keys (dates)
        // this.valuesArray = entries.map(([, value]) => value); // Extract values
        // console.log("efwwfw",this.applicationActivity);  
        this.shared.showLoader.next(false);
    //   },
    //   error => {    
    //     this.shared.showLoader.next(false);
    //     console.error(error)
    //     this.shared.showError(error.message)
    //   }
    // )
  }

  ngAfterViewInit() {
    this.commandDataSource.paginator = this.commandPaginator;
    this.estateDataSource.paginator = this.estatePaginator;
  }

  onCardClick(item: any) {
    this.cards_remote.forEach(card => card.isActive = false);
    item.isActive = true;
    console.log(item.title + ' clicked!');
  }

  toggleView() {
    this.view = !this.view;
    this.insideview = !this.insideview;
    this.viewChange.emit(this.view);
    this.insideviewChange.emit(this.insideview);
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
   selectTabApp(tab: string) {
     this.selectedTabApp = tab;
   }
   selectTabRemote(tab:string) {
    this.selectedTabRemote = tab;
   }
   selectTabInSettings(tab:string) {
    this.selectedTabInSettings = tab;
   }

  abc() {
    console.log("wfwq")
  }

  demo(ele) {
    console.log("fkw",ele)
  }


  changeContent(condition: string) {
    this.contentCondition = condition;
  }

  onToggleChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.toggleText = isChecked ? 'On' : 'Off';
    console.log('Toggle switch state:', this.toggleText);
  }
}
