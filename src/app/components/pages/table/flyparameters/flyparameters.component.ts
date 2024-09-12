import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DesignSelectionComponent } from 'src/app/components/dialogs/design-selection/design-selection.component';
import { DevicesFormComponent } from 'src/app/components/dialogs/device-form/device-form.component';
import { SelectCfgComponent } from 'src/app/components/dialogs/select-cfg/select-cfg.component';
import { TerminalProfileComponent } from 'src/app/components/dialogs/terminal-profile/terminal-profile.component';
import { deleteModelEvent } from 'src/app/services/login/body/event';
import { SharedServices } from 'src/app/services/shared.service';
import { TerminalService } from 'src/app/services/terminal/devicelist';
import { ProfileComponent } from '../profile/profile.component';


@Component({
  selector: 'app-flyparameters',
  templateUrl: './flyparameters.component.html',
  styleUrl: './flyparameters.component.scss'
})
export class FlyparametersComponent {
clicked() {
this.showDynamicKeys = true;
}
  searchTerm: string = '';
  selectedTab: string = 'profile'; // Default tab
  deployments = [];
  filteredDeployments = [];
  creationTime = "";
  modificaionTime = "";
  parameterCount = "";
  selectedItem: any;
  labelsm: string[] = ['Pending Publish','Published','Downloaded','Download failed'];
  seriesm: number[] = [0,0,0,0];
  colors: string[] = [
    '#FF6B6B',  // Bright Red
    '#4ECDC4',  // Teal
    '#FFA500',  // Orange
    '#9B59B6'   // Purple
  ];
  showDynamicKeys = true;
  filteredDevices= [];
  statusFilter = '';
  devices = [];
    profile: any;
    param: any;
    @ViewChild(ProfileComponent) childComponent!: ProfileComponent;
    packageId:any;
    serialNo: any;
    deviceId: any;
    selectedName;

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
         this.selectedName = params['name'];
      });
    // Initialize filteredDeployments with all deployments on load
    this.getPacks();
  }

  getPacks(){
    const payload = {
        "event": {
            "eventType": "SCHEDULE",
            "eventSubType": "UPDATE"
        }
    }
    this.dataService.getPacks(payload).subscribe(
        response => {
          this.deployments = response.event.eventData;
          this.filteredDeployments = this.deployments;
          if(this.selectedName){
            const data = this.filteredDeployments.filter(e=> e.name == this.selectedName);
           this.selectItem(data[0]);
          }
        }
      )
  }

  saveData() {
    this.childComponent.performSave();
  }

  viewData() {
    this.childComponent.performView();
  }

  constructor(public dialog: MatDialog,private dataService: TerminalService,private router:ActivatedRoute){}

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

  openCreateDialog(data?: any): void {
    const dialogRef = this.dialog.open(DevicesFormComponent, {
      data: {
        title: 'New Terminal',
        form: {
          dsn: data?.dsn,
        }
      },
      width: '40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const payload = {
            "event": {
                "eventData": result,
                "eventType": "DEVICE",
                "eventSubType": "SEARCH"
            }
        }
        this.dataService.getDevicebysn(payload).subscribe(
          response => {
            this.serialNo = response.event.eventData.serialNumber;
            this.deviceId = response.event.eventData.id;
            const payload = {
                "event": {
                    "eventData": this.packageId,
                    "eventType": "DEVICE",
                    "eventSubType": "SEARCH"
                }
            }
            this.dataService.getParamByPackage(payload).subscribe(
              response => {
                this.openCheckDialog(response.event.eventData);
              },
              (error)=>{
                alert("Invalid device")
              }
            )
          },
          (error)=>{
            alert("Invalid device")
          }
        )
      }
    });
  }

  view(){
    const payload = {
        "event": {
            "eventData": this.packageId,
            "eventType": "DEVICE",
            "eventSubType": "SEARCH"
        }
    }
    this.dataService.getParamByPackage(payload).subscribe(
      response => {
        const dialogRef = this.dialog.open(TerminalProfileComponent, {
            data: {
              title: 'Profile',
              items: response.event.eventData.filter(e=> !e.delete)
            },
            width: '60%'
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
          });
      },
      (error)=>{
      }
    )
  }

  delete(id){
    const payload = {
        "event": {
            "eventData": id,
            "eventType": "SCHEDULE",
            "eventSubType": "UPDATE"
        }
    }
    this.dataService.deleteScheduleParamJob(payload).subscribe(
        response => {
            this.selectItem(this.selectedItem);
            this.selectedTab = 'terminal';
        },
        (error)=>{
        }
      )
  }

  edit(){
    const payload = {
        "event": {
            "eventData": this.packageId,
            "eventType": "DEVICE",
            "eventSubType": "SEARCH"
        }
    }
    this.dataService.getParamByPackage(payload).subscribe(
      response => {
        this.profile = response.event.eventData;
        this.showDynamicKeys = false;
      },
      (error)=>{
      }
    )
  }
  openCheckDialog(data?: any): void {
    const dialogRef = this.dialog.open(TerminalProfileComponent, {
      data: {
        title: 'New Terminal',
        items: data.filter(e=> !e.delete)
      },
      width: '60%'
    });

    dialogRef.afterClosed().subscribe(result => {
      let publish;
      if (result) {
        publish = "PUBLISHED";
      }else{
        publish = "PUBLISH_PENDING"
      }
      const payload = {
        "event": {
            "eventData": {
                "deviceId": this.deviceId,
                "packageId":this.packageId,
                "serialNumber":this.serialNo,
                "status": publish
            },
            "eventType": "SCHEDULE",
            "eventSubType": "CREATE"
        }
    }
      this.dataService.scheduleJobParams(payload).subscribe(
        response => {
          this.selectItem(this.selectedItem);
          this.selectedTab = 'terminal';
        },
        (error)=>{
          alert("Invalid device")
        }
      )
    });
  }




  selectItem(deployment: any) {
    this.selectedItem = deployment;
    this.packageId = deployment.id;
    const payload = {
        "event": {
            "eventData": {
                "packageId": deployment.id
            },
            "eventType": "SCHEDULE",
            "eventSubType": "UPDATE"
        }
    }
    this.dataService.getParamCount(payload).subscribe(
        response => {
            const data = response.event.eventData;
          this.selectedTab = data.parametersCount > 0 ? 'profile' : 'emptyData';
          this.creationTime = data.creationTimeStamp;
          this.modificaionTime = data.lastUpdatedTimeStamp;
          this.parameterCount = data.parametersCount;
          this.devices = data.scheduleParameterJobDetails;
          this.filteredDevices = this.devices;
          this.seriesm = [];
          this.seriesm.push(data.jobsUpdateStatistics.pendingPublish);
          this.seriesm.push(data.jobsUpdateStatistics.published);
          this.seriesm.push(data.jobsUpdateStatistics.downloaded);
          this.seriesm.push(data.jobsUpdateStatistics.downloadFailed);
        }
      )
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  designSelection() {
    const dialogRef = this.dialog.open(DesignSelectionComponent, {
        height: '80%',
        width: '40%'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
            if(result?.type){
                this.profile = result.profile;
                this.param = result.parameters;
                this.showDynamicKeys = false;
            }else{
              const dialogRef = this.dialog.open(SelectCfgComponent);
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.profile = [];
                    this.param = [];
                    this.showDynamicKeys = false;
                }
              });
            }
        }
      });
    }


      search() {
        this.filteredDevices = this.devices.filter(device =>
          device.serialNumber?.toLowerCase().includes(this.searchTerm?.toLowerCase()) &&
          (this.statusFilter === '' || device.jobStatus === this.statusFilter)
        );
      }
  }
