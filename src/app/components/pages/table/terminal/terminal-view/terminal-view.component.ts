import { Component, EventEmitter, Input, Output } from '@angular/core';


export interface AppData {
  app: string;
  packageName: string;
  applicationInstallationInfo: string;
  parameterFileVersion: string;
  parameterFileStatus: string;
  publish: string;
  operation: string;
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
  selectedTab: string = 'overview';
  selectedTabApp:string =  'deployment';
  selectedTabRemote:string = 'diagnosis';
  toggleText: string = 'Off';
  contentCondition: string = 'Device'; // Default content condition
  displayedColumns: string[] = ['app', 'packageName', 'applicationInstallationInfo', 'parameterFileVersion', 'parameterFileStatus', 'publish', 'operation'];
  dataSource: AppData[] = [
    { app: 'NEDBANK POS', packageName: 'com.ar.nedbankpos', applicationInstallationInfo: 'Installed/In Deployment', parameterFileVersion: '1.0.0', parameterFileStatus: 'Pending publish', publish: '', operation: '' }
    // Add more data objects as needed
  ];
  cards = [
    { header: 'Storage', percentage: 60,icon:'file_present' },
    { header: 'Modules', percentage: 70,icon:'view_module' },
    { header: 'Traffic', percentage: 50,icon:'traffic' },
    { header: 'Battery', percentage: 80,icon:'battery_4_bar' }
  ];
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

  abc() {
    console.log("wfwq")
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
