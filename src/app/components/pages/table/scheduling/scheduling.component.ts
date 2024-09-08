import { Component } from '@angular/core';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';

interface UpdateStatistic {
  date: string;
  value: number;
}

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrl: './scheduling.component.scss'
})
export class SchedulingComponent {
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
    const filterValue = this.searchTerm.trim()?.toLowerCase();
    
    if (filterValue) {
      this.filteredDeployments = this.deployments.filter(deployment =>
        deployment.name?.toLowerCase().includes(filterValue)
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
}
