import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.component.html',
  styleUrl: './view-data.component.scss'
})
export class ViewDataComponent {

  collapsedKeys: Set<string> = new Set(); 
  toggledKeys: { [key: string]: boolean } = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { items: any },
    private dialogRef: MatDialogRef<ViewDataComponent>
  ) {}
  isModalOpen = false;
  // jsonData = {
  //   '3rd Party Apps': {
  //     '3rdPartyApps_01': ['com.ar.layup'],
  //     '3rdPartyApps_02': ['com.triplejumptech.horizon'],
  //     '3rdPartyApps_03': ['com.dashpay.vas'],
  //     '3rdPartyApps_04': ['com.ar.valueadds'],
  //     '3rdPartyApps_05': ['za.co.nedbank.rp'],
  //     '3rdPartyApps_06': ['com.payflow.ezagapos'],
  //     '3rdPartyApps_07': ['za.co.bbsoft.mobilepos'],
  //     '3rdPartyApps_08': ['com.easipolmobile'],
  //     '3rdPartyApps_09': ['com.example.mycalculator'],
  //     '3rdPartyApps_10': ['com.istatik.mobile'],
  //     '3rdPartyApps_11': ['com.waxdpayment.waxdtransport'],
  //   },
  // };

  openModal() {
    this.isModalOpen = true;
  }

  toggleCollapse(key: string) {
    if (this.collapsedKeys.has(key)) {
      this.collapsedKeys.delete(key);
    } else {
      this.collapsedKeys.add(key);
    }
  }

  isCollapsed(key: string): boolean {
    return this.collapsedKeys.has(key);
  }

  closeModal() {
    this.isModalOpen = false;
  }
} 
