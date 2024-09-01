import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DesignSelectionComponent } from 'src/app/components/dialogs/design-selection/design-selection.component';
import { SelectCfgComponent } from 'src/app/components/dialogs/select-cfg/select-cfg.component';
import { SharedServices } from 'src/app/services/shared.service';

@Component({
  selector: 'app-flyparameters',
  templateUrl: './flyparameters.component.html',
  styleUrl: './flyparameters.component.scss'
})
export class FlyparametersComponent {
  searchTerm: string = '';
  selectedTab: string = 'profil'; // Default tab
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
  labelsm: string[] = ['Pending Publish','Published','Downloaded','Updated','Update failed'];
  seriesm: number[] = [20,30,17,13,20];
  colors: string[] = ['#6956CE', '#1CD3D2', '#4788ff','#3657ff','#2456ff'];

  ngOnInit() {
    // Initialize filteredDeployments with all deployments on load
    this.filteredDeployments = this.deployments;
  }

  constructor(public dialog: MatDialog, private shared:SharedServices){}

  filterDeployments() {
    const filterValue = this.searchTerm.trim().toLowerCase();

    if (filterValue) {
      this.filteredDeployments = this.deployments.filter(deployment =>
        deployment.name.toLowerCase().includes(filterValue)
      );
    } else {
      this.filteredDeployments = this.deployments;
    }
  }


  selectItem(deployment: any) {
    this.selectedItem = deployment;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  designSelection() {
    const dialogRef = this.dialog.open(DesignSelectionComponent, {
        data: { },
        height: '80%',
        width: '40%'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
            const dialogRef = this.dialog.open(SelectCfgComponent, {
                data: { },
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                }
              });
        }
      });
  }

}
