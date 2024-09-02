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
    { name: 'GetPaid+', icon: 'assets/getpaid-icon.png', version: '5.3.1Prod' },
    { name: 'FNB POS', icon: 'assets/fnb-icon.png', version: '5.00 - (0320 202407091200)' },
    { name: 'App Selector', icon: 'assets/app-selector-icon.png', version: '0.3' },
    { name: 'NEDBANK POS', icon: 'assets/nedbank-icon.png', version: '14.0.7.0D H0' },
    { name: 'ValueAdds', icon: 'assets/valueadds-icon.png', version: '1.0.6' },
    { name: 'Bridge', icon: 'assets/bridge-icon.png', version: '2.4' },
    { name: 'DASHPAY POS', icon: 'assets/dashpay-icon.png', version: '2.7.3P' },
    { name: 'RKLA Demo', icon: 'assets/rkla-icon.png', version: '1.1.0' },
  ];

  filteredResources: Resource[] = [];
  searchTerm: string = '';
  flyParameterApp: string = '';
  viewMode: 'grid' | 'list' = 'grid';

  ngOnInit() {
    this.filteredResources = this.resources;
  }

  search() {
    this.filteredResources = this.resources.filter(resource => 
      resource.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  addNew() {
    // Implement add new resource functionality
    console.log('Add new resource');
  }
}
