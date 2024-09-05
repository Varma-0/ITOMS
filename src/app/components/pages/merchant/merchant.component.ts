import { Component, OnInit } from '@angular/core';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';



function aggregateDataByStatus(data: any[]): { status: string, count: number }[] {
  const statusCount = data.reduce((acc, item) => {
    if (!acc[item.status]) {
      acc[item.status] = 0;
    }
    acc[item.status]++;
    return acc;
  }, {});

  return Object.keys(statusCount).map(status => ({
    status,
    count: statusCount[status]
  }));
}


@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrl: './merchant.component.scss'
})


export class MerchantComponent implements OnInit {
  sidebarItems: string[] = ['StandardPos1', 'StandardPos2']; // List of sidebar items
  selectedItem: string = this.sidebarItems[0]; // Default selected item
  selectedTab: string = 'overview'; // Default tab
  selectedTabinDevices: string = 'status';
  data: any; // Data fetched from the API
  labelsm: string[] = [];
  seriesm: number[] = [];
  colors: string[] = ['#6956CE', '#1CD3D2', '#4788ff'];
  ELEMENT_DATA: any[] = [
    { sn: 'JCA100615093', model: 'SP630 ECR', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'JCA100615093', model: 'SP630 ECR2423', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'PLB400003968', model: 'P180', status: 'Locked', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'PLB400003945', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'JC9500232565', model: 'SP630 Pro', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'JCA100615093', model: 'SP630 ECR', status: 'Locked', onlineStatus: 'Online', activationTime: 'N/A' },
    { sn: 'PLB400003968', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'PLB400003945', model: 'P180', status: 'Inventory', onlineStatus: 'Online', activationTime: 'N/A' },
    { sn: 'JC9500232565', model: 'SP630 Pro', status: 'Lost', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'JCA100615093', model: 'SP630 ECR', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'PLB400003968', model: 'P180', status: 'Locked', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'PLB400003945', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'JC9500232565', model: 'SP630 Pro', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'JCA100615093', model: 'SP630 ECR', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'PLB400003968', model: 'P180', status: 'Inventory', onlineStatus: 'Online', activationTime: 'N/A' },
    { sn: 'PLB400003945', model: 'P180', status: 'Locked', onlineStatus: 'Online', activationTime: 'N/A' },
    { sn: 'JC9500232565', model: 'SP630 Pro', status: 'Lost', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'JCA100615093', model: 'SP630 ECR', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'PLB400003968', model: 'P180', status: 'Locked', onlineStatus: 'Online', activationTime: 'N/A' },
    { sn: 'PLB400003945', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'JC9500232565', model: 'SP630 Pro', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'JCA100615093', model: 'SP630 ECR', status: 'Lost', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'PLB400003968', model: 'P180', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'PLB400003945', model: 'P180', status: 'Lost', onlineStatus: 'Offline', activationTime: 'N/A' },
    { sn: 'JC9500232565', model: 'SP630 Pro', status: 'Inventory', onlineStatus: 'Offline', activationTime: 'N/A' },
  
    // Add more rows as needed
  ];
  
  constructor(private dataService: TerminalService) {}

  series: number[];
  labels: string[];
  totalValue: number;

  ngOnInit() {
    const aggregatedData = aggregateDataByStatus(this.ELEMENT_DATA);
    this.prepareChartData();
    this.series = aggregatedData.map(item => item.count);
    this.labels = aggregatedData.map(item => item.status);
    this.totalValue = this.series.reduce((sum, value) => sum + value, 0);
  }

  private prepareChartData() {
    // Count occurrences of each model
    const modelCounts = this.ELEMENT_DATA.reduce((acc: any, item: any) => {
      if (!acc[item.model]) {
        acc[item.model] = 0;
      }
      acc[item.model]++;
      return acc;
    }, {});

    this.labelsm = Object.keys(modelCounts);
    this.seriesm = Object.values(modelCounts);
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

  selectTabinDevices(tab: string) {
    this.selectedTabinDevices = tab;
  }

  edit(element) {

  }

}
