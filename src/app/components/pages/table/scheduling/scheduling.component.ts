import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeploymentModalComponent } from 'src/app/components/dialogs/deployment-modal/deployment-modal.component';
import { DevicesFormComponent } from 'src/app/components/dialogs/device-form/device-form.component';
import { SharedServices } from 'src/app/services/shared.service';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';

interface UpdateStatistic {
  date: string;
  value: number;
}

interface Device {
  deviceSN: string;
  organization: string;
  parameterFileVersion: string;
  parameterFileStatus: string;
  parameterFilePublishTime: string;
}

interface Device1 {
  sn: string;
  model: string;
  status: string;
  onlineStatus: string;
  bindingTime: string;
  process: number;
}


@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrl: './scheduling.component.scss'
})
export class SchedulingComponent {
  data: any;
  selectedCount: number = 0;
  constructor(public dialog: MatDialog, private shared:SharedServices,private dataService: TerminalService){}

  connectedTerminals = 1;
  unconnectedTerminals = 0;
  activeTerminals = 0;
  inactiveTerminals = 1;
  overallProgress = 0;

  updateStatistics: UpdateStatistic[] = [
    { date: '2024-08-31', value: 0 },
    { date: '2024-09-01', value: 0 },
    { date: '2024-09-02', value: 0 },
    { date: '2024-09-03', value: 0 },
    { date: '2024-09-04', value: 0 },
    { date: '2024-09-05', value: 0 },
    { date: '2024-09-06', value: 0 }
  ];
  searchTerm: string = '';
  selectedTerminals: Set<any> = new Set();

  searchTerms: string = '';
  selectedTab: string = 'settings'; // Default tab
  devices1: Device1[] = [
    { sn: 'NCA700083597', model: 'N950', status: 'Inventory', onlineStatus: 'Offline', bindingTime: '09/09/2024', process: 0 }
  ];
  deployments = [
      { name: 'P180', count: 2 },
      { name: 'U1000', count: 0 },
      { name: 'SP930', count: 0 },
      { name: 'lipp', count: 1 },
      { name: 'SP550', count: 1 },
      { name: 'SP550 TEST', count: 1 },
      // Add more as needed
  ];
  devices: Device[] = [
    {
      deviceSN: 'NCA700083597',
      organization: 'DEMOQZRNAXTpjSgS',
      parameterFileVersion: '',
      parameterFileStatus: 'Pending publish',
      parameterFilePublishTime: ''
    },
    {
      deviceSN: 'NCA700083598',
      organization: 'DEMOQZRNAXTpjSgS',
      parameterFileVersion: '1',
      parameterFileStatus: 'Published',
      parameterFilePublishTime: '09/06/2024 12:15:27'
    }
  ];
  filteredTerminals = [];
  statusFilter = '';
  filteredDeployments = [];
  selectedItem: any;
  checkk: boolean = false;

  ngOnInit() {
    // Initialize filteredDeployments with all deployments on load
    this.filteredDeployments = this.deployments;
  }

  isAllSelected(): boolean {
    return this.filteredTerminals.length > 0 && this.selectedTerminals?.size === this.filteredTerminals.length;
  }

  filterDeployments() {
    const filterValue = this.searchTerm.trim()?.toLowerCase();
    
    if (filterValue) {
      this.filteredDeployments = this.deployments.filter(deployment =>
        deployment.name?.toLowerCase().includes(filterValue)
      );
    } else {
      this.filteredDeployments = this.deployments;
    }
  }

  openCreateTerminalDialog(data?: any,edit?): void {
    const dialogRef = this.dialog.open(DevicesFormComponent, {
      data: {
        title: edit? 'New Terminal' : 'Delete Terminal',
        form: {
          dsn: data?.dsn,
        }
      },
      width: '40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("1111111111",result);
      if (result) {
        
      }
    });
  }

  openCreateDeployDialog(): void {
    const dialogRef = this.dialog.open(DevicesFormComponent, {
      data: {
        title: 'Create Deployment',
        form: {
          
        }
      },
      width: '40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("1111111111",result);
      if (result) {
        
      }
    });
  }
  
  openCreateDialog(data?: any): void {
    const dialogRef = this.dialog.open(DeploymentModalComponent, {
      width: '60%', // Adjust as needed
      data: {
        appData: {
          icon: "/assets/app-icon.png",
          name: "DASHPAY POS",
          packageName: "com.ar.dashpaypos",
          version: "2.7.3P",
          releaseType: "Release",
          releaseDate: "04/09/2024 18:14:12",
          details: {
            "Version Code": "126",
            "Installed Devices": "0",
            "Installation Mode": "Incremental Update",
            "Update Mode": "Auto Update",
            "Disable Uninstall": "No",
            "Total File Size": "31.37 MB",
            "File MD5": "94B334285923809AB451F6DF16AA511B",
            "Distribute": "ALL",
            "Supported Device Models": "N950 ,N910 Pro ,N910 ,N950S ECR ,N700 ...",
            "Deployment": "Reddy Test"
          }
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Dialog closed", result);
      if (result) {
        // Handle the result
      }
    });
  }
  selectedDevices: Device[] = [];


 

  // toggleSelectAll(event: Event) {
  //   const isChecked = (event.target as HTMLInputElement).checked;
  //   this.data.forEach(device => {
  //     device.selected = isChecked;
  //   });
  // }

  selectItem(deployment: any) {
    this.selectedItem = deployment;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }


  get totalTerminals(): number {
    return this.connectedTerminals + this.unconnectedTerminals;
  }

  get connectedPercentage(): number {
    return (this.connectedTerminals / this.totalTerminals) * 100;
  }

  get unconnectedPercentage(): number {
    return (this.unconnectedTerminals / this.totalTerminals) * 100;
  }

  get activePercentage(): number {
    return (this.activeTerminals / this.totalTerminals) * 100;
  }

  get inactivePercentage(): number {
    return (this.inactiveTerminals / this.totalTerminals) * 100;
  }

  getPolylinePoints(): string {
    return this.updateStatistics.map((stat, index) => 
      `${40 + index * 100},${180 - stat.value * 165}`
    ).join(' ');
  }

  search() {
    this.filteredTerminals = this.devices.filter(device =>
      device.deviceSN?.toLowerCase().includes(this.searchTerm?.toLowerCase()) &&
      (this.statusFilter === '' || device.parameterFileStatus === this.statusFilter)
    );
  }

  search1() {
    this.filteredTerminals = this.devices.filter(device =>
      device.deviceSN?.toLowerCase().includes(this.searchTerms?.toLowerCase()) &&
      (this.statusFilter === '' || device.parameterFileStatus === this.statusFilter)
    );
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selectedTerminals.clear();
    } else {
      this.filteredTerminals.forEach(schedule => this.selectedTerminals.add(schedule.id));
    }
  }
  
  toggleSelection(terminal: Device1): void {
    if (this.selectedTerminals.has(terminal.sn)) {
      this.selectedTerminals.delete(terminal.sn);
    } else {
      this.selectedTerminals.add(terminal.sn);
    }
  }



  isSelected(terminal: Device1): boolean {
    return this.selectedTerminals.has(terminal.sn);
  }

  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;
    this.filteredTerminals.forEach(device => device.selected = isChecked);
    this.updateSelectedCount();
  }

  updateSelectedCount() {
    this.selectedCount = this.filteredTerminals.filter(device => device.selected).length;
  }

  deleteSelected() {
    this.filteredTerminals = this.filteredTerminals.filter(device => !device.selected);
    this.updateSelectedCount();
  }
}
