import { Component } from '@angular/core';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrl: './scheduling.component.scss'
})
export class SchedulingComponent {
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
  filteredDeployments = [...this.deployments];
  selectedItem: any;

  filterDeployments() {
    this.filteredDeployments = this.deployments.filter(deployment =>
      deployment.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  

  selectItem(deployment: any) {
    this.selectedItem = deployment;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
