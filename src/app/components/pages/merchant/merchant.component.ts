import { Component } from '@angular/core';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrl: './merchant.component.scss'
})
export class MerchantComponent {
  selectedTab: string = 'overview';

  selectTab(tab: string) {
    this.selectedTab = tab;
    console.log(this.selectedTab);
  }
}
