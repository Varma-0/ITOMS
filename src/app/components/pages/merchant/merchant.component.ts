// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-merchant',
//   templateUrl: './merchant.component.html',
//   styleUrl: './merchant.component.scss'
// })
// export class MerchantComponent {
//   selectedTab: string = 'overview';
//   selectedItem: string = 'StandardPos1'; 

//   selectTab(tab: string) {
//     this.selectedTab = tab;
//     console.log(this.selectedTab);
//   }

//   selectItem(item: string) {
//     this.selectedItem = item;
//     // Optionally reset tab selection when changing item
//     this.selectedTab = 'overview'; // Reset to default tab
//   }
// }

import { Component, OnInit } from '@angular/core';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrl: './merchant.component.scss'
})
export class MerchantComponent implements OnInit {
  sidebarItems: string[] = ['StandardPos1', 'StandardPos2']; // List of sidebar items
  selectedItem: string = this.sidebarItems[0]; // Default selected item
  selectedTab: string = 'overview'; // Default tab
  data: any; // Data fetched from the API

  constructor(private dataService: TerminalService) {}

  ngOnInit() {
    const event = new terminalEvent('MERCHANT', 'SEARCH');
    const merchantRequest = new terminalBody(event);
    this.dataService.merchantData(merchantRequest).subscribe(
      response=> {
        console.log(response);
      },
      error => {
        console.error('Error:', error);
      }
    )
  }

  // Method to handle item selection from the sidebar
  selectItem(item: string) {
    this.selectedItem = item;
    // this.fetchData(item); // Fetch data for the selected item
    this.selectedTab = 'overview'; // Reset to default tab
  }

  // Method to handle tab selection
  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
