import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DesignSelectionComponent } from 'src/app/components/dialogs/design-selection/design-selection.component';
import { DevicesFormComponent } from 'src/app/components/dialogs/device-form/device-form.component';
import { SelectCfgComponent } from 'src/app/components/dialogs/select-cfg/select-cfg.component';
import { TerminalProfileComponent } from 'src/app/components/dialogs/terminal-profile/terminal-profile.component';
import { deleteModelEvent } from 'src/app/services/login/body/event';
import { SharedServices } from 'src/app/services/shared.service';
import { TerminalService } from 'src/app/services/terminal/devicelist';

interface Device {
  deviceSN: string;
  organization: string;
  parameterFileStatus: string;
  parameterFilePublishTime: string;
}

@Component({
  selector: 'app-flyparameters',
  templateUrl: './flyparameters.component.html',
  styleUrl: './flyparameters.component.scss'
})
export class FlyparametersComponent {
  searchTerm: string = '';
  selectedTab: string = 'profile'; // Default tab
  deployments = [
      { name: 'P180', count: 2 },
      { name: 'U1000', count: 0 },
      { name: 'SP930', count: 0 },
      { name: 'lipp', count: 1 },
      { name: 'SP550', count: 1 },
      { name: 'SP550 TEST', count: 1 },
      // Add more as needed
  ];
  filteredDeployments = [];
  selectedItem: any;
  labelsm: string[] = ['Pending Publish','Published','Downloaded','Download failed'];
  seriesm: number[] = [20,30,17,13];
  colors: string[] = [
    '#FF6B6B',  // Bright Red
    '#4ECDC4',  // Teal
    '#FFA500',  // Orange
    '#9B59B6'   // Purple
  ];
  showDynamicKeys = true;
  filteredDevices: Device[] = [];
  statusFilter = '';
  devices: Device[] = [
    {
      deviceSN: 'NCA700083597',
      organization: 'DEMOQZRNAXTpjSgS',
      parameterFileStatus: 'Pending publish',
      parameterFilePublishTime: ''
    },
    {
      deviceSN: 'NCA700083598',
      organization: 'DEMOQZRNAXTpjSgS',
      parameterFileStatus: 'Published',
      parameterFilePublishTime: '09/06/2024 12:15:27'
    }
  ];
    profile: any;
    param: any;

  ngOnInit() {
    // Initialize filteredDeployments with all deployments on load
    this.filteredDeployments = this.deployments;
    this.filteredDevices = this.devices;

  }

  constructor(public dialog: MatDialog, private shared:SharedServices,private dataService: TerminalService){}

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
      console.log("1111111111",result);
      if (result) {
        this.openCheckDialog(result);
      }
    });
  }

  openCheckDialog(data?: any): void {
    const dialogRef = this.dialog.open(TerminalProfileComponent, {
      data: {
        title: 'New Terminal',
        form: {
          dsn: data?.dsn,
        }
      },
      width: '40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("1111111111",result);
      if (result) {
        const flyPara = new deleteModelEvent(data,'DEVICE','SEARCH');
        const payload = {
          event: flyPara
        }
        this.dataService.getDevicebysn(payload).subscribe(
          response => {
            console.log("fd",response);
          }
        )

      }
    });
  }




  selectItem(deployment: any) {
    this.selectedItem = deployment;
    this.selectedTab = deployment.count > 0 ? 'profile' : 'emptyData';
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
          device.deviceSN?.toLowerCase().includes(this.searchTerm?.toLowerCase()) &&
          (this.statusFilter === '' || device.parameterFileStatus === this.statusFilter)
        );
      }
  }
