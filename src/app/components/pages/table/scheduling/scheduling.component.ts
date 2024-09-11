import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeploymentModalComponent } from 'src/app/components/dialogs/deployment-modal/deployment-modal.component';
import { DevicesFormComponent } from 'src/app/components/dialogs/device-form/device-form.component';
import { SettingDialogComponent } from 'src/app/components/dialogs/setting-dialog/setting-dialog.component';
import { deleteMerchantEVent } from 'src/app/services/login/body/event';
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
  modelNameBasedOnSN: any;
  processInTerminal: any;
  constructor(public dialog: MatDialog, private shared:SharedServices,private dataService: TerminalService){}

  connectedTerminals = 0;
  totalTerminals = 0;
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
  deployments = [];
  filteredTerminals = [];
  statusFilter = '';
  filteredDeployments = [];
  selectedItem: any;
  settingsInApplication = [];
  settingsInTerminal = [];
  checkk: boolean = false;

  ngOnInit() {
    this.loadDeploymentsData();
  }

  loadDeploymentsData() {
    const payload = {
      "event" : {
        "eventType": "DEPLOYMENT",
        "eventSubType": "SEARCH"
      }
    }
    this.dataService.getDeployment(payload).subscribe(
      response => {
        // console.log("qdoog",response);
        this.deployments = response.event.eventData;
        this.filteredDeployments = this.deployments;
      }
    )
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

  openCreateTerminalDialog(edit?: any,data?: any): void {
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
        if (edit) {
          const payloadForModel = {
            "event": {
                "eventData": result,
                "eventType": "DEVICE",
                "eventSubType": "SEARCH"
            }
          }
          this.dataService.getDevicebysn(payloadForModel).subscribe(
            response => {
              this.modelNameBasedOnSN = response.event.eventData.modelName;
            },
            error => {
              console.error(error);
            }
          )
          const payload = {
            "event": {
                "eventData": {
                    "deploymentId": this.selectedItem.id,
                    "deploymentName": this.selectedItem.name,
                    "serialNumber": result,
                    "model": this.modelNameBasedOnSN,
                    "status": "PENDING",
                    "onlineStatus": "OFFLINE"
                },
                "eventType": "DEPLOYMENT",
                "eventSubType": "CREATE"
            }
          }
          this.dataService.addTerminal(payload).subscribe(
            response => {
              console.log("erecw",response);
              this.getTerminalData();
            },
            error => {
              console.error(error);
            }
          );
        } else if (!edit) {
          const deletePayload = {
            "event": {
                "eventData": {
                    "deploymentId" : this.selectedItem.id,
                    "deploymentName": this.selectedItem.name,
                    "serialNumber": result
                },
                "eventType": "DEPLOYMENT",
                "eventSubType": "CREATE"
            }
          }
          this.dataService.deleteTerminal(deletePayload).subscribe(
            response => {
              console.log("erecw",response);
              this.getTerminalData();
            },
            error => {
              console.error(error);
            }
          )
        }
      }
    });
  }

  openCreateDeployDialog(): void {
    const dialogRef = this.dialog.open(DevicesFormComponent, {
      data: {
        title: 'Create Deployment',
      },
      width: '40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("1111111111",result);
      if (result) {
        const payload = {
          "event": {
            "eventData": result,
            "eventType": "DEPLOYMENT",
            "eventSubType": "CREATE"
          }
        }
        this.dataService.createDeployment(payload).subscribe(
          response => {
            console.log("dvub",response);
            this.loadDeploymentsData();
          }
        )
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
    this.getSettingsData();

  }

  getSettingsData() {
    const payload = {
      "event": {
        "eventData": this.selectedItem.id,
        "eventType": "DEPLOYMENT",
        "eventSubType": "CREATE"
      }
    }
    this.dataService.settingsInDeployment(payload).subscribe(
      response => {
        console.log("21821",response);
        if (response.event.eventData != 'null') {
          this.settingsInApplication = response.event.eventData
          this.selectTab('settings');
        }  else {
          this.settingsInApplication = [];
        }
      }
    );
  }

  getTerminalData() {
    const payload = {
      "event": {
        "eventData": this.selectedItem.id,
        "eventType": "DEPLOYMENT",
        "eventSubType": "CREATE"
      }
    }
    this.dataService.terminalInDeployment(payload).subscribe(
      response => {
        if (response.event.eventData != 'null') {
          this.settingsInTerminal = response.event.eventData
          this.filteredTerminals = this.settingsInTerminal
        }  else {
          this.settingsInTerminal = [];
          this.filteredTerminals = this.settingsInTerminal
        }
      }
    );
  }

  getProcessData() {
    const payload = {
      "event": {
        "eventData": this.selectedItem.id,
        "eventType": "DEPLOYMENT",
        "eventSubType": "CREATE"
      }
    }
    this.dataService.processInDeployment(payload).subscribe(
      response => {
        if (response.event.eventData != 'null') {
          this.processInTerminal = response.event.eventData
          this.totalTerminals = response.event.eventData.totalTerminals;
          this.connectedTerminals = response.event.eventData.connectedTerminals;
          this.unconnectedTerminals = response.event.eventData.unConnectedTerminals;
          this.activeTerminals = response.event.eventData.activeTerminals;
          this.inactiveTerminals = response.event.eventData.inActiveTerminals;
        }  else {
          this.processInTerminal = [];
        }
      }
    );
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
     if(this.selectedTab == 'process') {
      console.log("ewufwew process")
      this.getProcessData();
    } else if(this.selectedTab == 'terminal') {
      this.getTerminalData();
    }
  }

  createSettingCard(): void{
    const dialogRef = this.dialog.open(SettingDialogComponent, {
      data: {
        id: this.selectedItem.id
      },
      width: '60%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("Dialog closed", result);
      if (result) {
        // Handle the result
        let deploymentList = result.map(app => ({
          packageId: app.id,  // Mapping 'id' to 'packageId'
          name: app.name,
          type: app.type,
          deploymentVersion: app.version
        }))
        const payload = {
          "event": {
              "eventData": {
                  "deploymentId": this.selectedItem.id,
                  "deploymentName": this.selectedItem.name,
                  "applicationInfoList": deploymentList
              },
              "eventType": "DEPLOYMENT",
              "eventSubType": "CREATE"
          }
        }
        this.dataService.addSetting(payload).subscribe(
          response=> {
            console.log("res",response);
            this.getSettingsData();
          }
        )
      }
    });
  }

  get connectedPercentage(): number {
    return this.totalTerminals ? (this.connectedTerminals / this.totalTerminals) * 100 : 0;
  }

  get unconnectedPercentage(): number {
    return this.totalTerminals ? (this.unconnectedTerminals / this.totalTerminals) * 100 : 0;
  }

  get activePercentage(): number {
    return this.totalTerminals ? (this.activeTerminals / this.totalTerminals) * 100 : 0;
  }

  get inactivePercentage(): number {
    return this.totalTerminals ? (this.inactiveTerminals / this.totalTerminals) * 100 : 0;
  }

  getPolylinePoints(): string {
    return this.updateStatistics.map((stat, index) =>
      `${40 + index * 100},${180 - stat.value * 165}`
    ).join(' ');
  }


  search1() {
    this.filteredTerminals = this.settingsInTerminal.filter(device =>
      device.serialNumber?.toLowerCase().includes(this.searchTerms?.toLowerCase()) &&
      (this.statusFilter === '' || device.status === this.statusFilter)
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
