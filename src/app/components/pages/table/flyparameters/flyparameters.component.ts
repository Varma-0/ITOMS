import { Component } from '@angular/core';

@Component({
  selector: 'app-flyparameters',
  templateUrl: './flyparameters.component.html',
  styleUrl: './flyparameters.component.scss'
})
export class FlyparametersComponent {
  searchTerm: string = '';
  selectedTab: string = 'settings'; // Default tab
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

  ngOnInit() {
    // Initialize filteredDeployments with all deployments on load
    this.filteredDeployments = this.deployments;
  }

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
}
