import { Component } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.service';

@Component({
  selector: 'app-setting-dialog',
  templateUrl: './setting-dialog.component.html',
  styleUrl: './setting-dialog.component.scss'
})
export class SettingDialogComponent {
  searchQueryCurrent: string = '';
  searchQueryOptional: string = '';
  hoveredApp: any = null;
  currentApps = [
    { name: 'DASHPAY POS', packageName: 'com.ar.dashpaypos', version: '2.7.3P', icon: 'assets/img/linux-icon.png' },
    { name: 'NEDBANK POS', packageName: 'com.ar.nedbankpos', version: '14.0.7.0D H0', icon: 'assets/img/linux-icon.png' },
    { name: 'FNB POS', packageName: 'com.ar.fnbpos', version: '5.00 - (0320)', icon: 'assets/img/linux-icon.png' }
  ];

  optionalApps = [
    { name: 'Dashpay', packageName: 'Dashpay', version: '4.41', icon: 'assets/img/linux-icon.png' },
    { name: 'Nedbank', packageName: 'Nedbank', version: '4.43', icon: 'assets/img/linux-icon.png' },
    { name: 'AdumoPOS', packageName: 'AdumoPOS', version: '1.13', icon: 'assets/img/linux-icon.png' },
    { name: 'RKLA Demo', packageName: 'com.newland.rklDemo', version: '1.1.0', icon: 'assets/img/linux-icon.png' },
    { name: 'TEST', packageName: 'TEST', version: '1.0.2', icon: 'assets/img/linux-icon.png' },
    { name: 'AVO RP', packageName: 'za.co.nedbank.rp', version: '1.3-release (211027151)', icon: 'assets/img/linux-icon.png' }
  ];
  constructor(private shared:SharedServices) {
    this.shared.setSidebarState(false);
  }

  moveToOptional(app: any) {
    // Remove app from currentApps and add it to optionalApps
    this.currentApps = this.currentApps.filter(a => a !== app);
    this.optionalApps.push(app);
  }

  moveToCurrent(app: any) {
    // Remove app from optionalApps and add it to currentApps
    this.optionalApps = this.optionalApps.filter(a => a !== app);
    this.currentApps.push(app);
  }
}
