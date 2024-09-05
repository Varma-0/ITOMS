import { Component } from '@angular/core';

interface Group {
  id: number;
  name: string;
  description: string;
  beginTime: string;
  endTime: string;
}


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent {
  searchTerm: string = '';
  selectedTab: string = 'task'; // Default tab
  deployments = [
      { name: 'DashPay 2', count: 1 },
      { name: 'Nedbank', count: 0 },
      { name: 'Dashpay', count: 2 },
      // Add more as needed
  ];
  filteredDeployments = [];
  selectedItem: any;
  groups: Group[] = [];
  selectedSchedules: Set<number> = new Set();
  searchText: string = '';

  get selectedCount(): number {
    return this.selectedSchedules.size;
  }

  isAllSelected(): boolean {
    return this.groups.length > 0 && this.selectedSchedules.size === this.groups.length;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selectedSchedules.clear();
    } else {
      this.groups.forEach(schedule => this.selectedSchedules.add(schedule.id));
    }
  }

  toggleSelection(schedule: Group): void {
    if (this.selectedSchedules.has(schedule.id)) {
      this.selectedSchedules.delete(schedule.id);
    } else {
      this.selectedSchedules.add(schedule.id);
    }
  }

  isSelected(schedule: Group): boolean {
    return this.selectedSchedules.has(schedule.id);
  }

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
