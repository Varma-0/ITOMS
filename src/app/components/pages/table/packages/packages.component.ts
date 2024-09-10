import { Component, OnInit } from '@angular/core';

interface Resource {
  name: string;
  icon: string;
  version: string;
}

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.scss'
})
export class PackagesComponent implements OnInit {
  resources: Resource[] = [
    { name: 'GetPaid+', icon: 'assets/img/getpaid.png', version: '5.3.1Prod' },
    { name: 'FNB POS', icon: 'assets/img/fnb.png', version: '5.00 - (0320 202407091200)' },
    { name: 'App Selector', icon: 'assets/img/apselector.png', version: '0.3' },
    { name: 'NEDBANK POS', icon: 'assets/img/nedbank.png', version: '14.0.7.0D H0' },
    { name: 'ValueAdds', icon: 'assets/img/linux-icon.png', version: '1.0.6' },
    { name: 'Bridge', icon: 'assets/img/linux-icon.png', version: '2.4' },
    { name: 'DASHPAY POS', icon: 'assets/img/linux-icon.png', version: '2.7.3P' },
    { name: 'RKLA Demo', icon: 'assets/img/linux-icon.png', version: '1.1.0' },
  ];
  create = true;
  insideCreate = false;
  filteredResources: Resource[] = [];
  searchTerm: string = '';
  selectedTab: string = 'applications';
  flyParameterApp: string = '';
  viewMode: 'grid' | 'list' = 'grid';

  ngOnInit() {
    this.filteredResources = this.resources;
  }

  search() {
    this.filteredResources = this.resources.filter(resource => 
      resource.name?.toLowerCase().includes(this.searchTerm?.toLowerCase())
    );
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  addNew() {
    // Implement add new resource functionality
    console.log('Add new resource');
  }

  onViewChange(newView: boolean) {
    this.create = newView;
  }

  // Handler for `insideviewChange` event
  onInsideViewChange(newInsideView: boolean) {
    this.insideCreate = newInsideView;
  }

  createResource(){
    this.create = !this.create;
    this.insideCreate = !this.insideCreate;
    console.log(this.insideCreate,"feqqw");
  }
}
